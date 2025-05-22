const User = require("../users/schemas/user.schema");

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
// const endingSeceret = "whsec_ba0b9661f8da5b99ebc6add4479b141f4f46078e5e9d724394fde256eea3a0ec";


 
function formatUnixTimestamp(timestamp) {
  if (!timestamp || isNaN(Number(timestamp))) {
    return null;
  }

  const date = new Date(Number(timestamp) * 1000);
  
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false // 24-hour format
  };
 console.log(date.toLocaleString('en-US', options), "date========>");
  return date.toLocaleString('en-US', options);
}



module.exports = {
  createPaymentCheckout: async (data) => {
    try {
      const { PRICE_ID, email, userId } = data;
      console.log(data, "data=========>");
      const user = await User.findById(userId);
      let customerId = user.stripeCustomerId;

      if (!customerId) {
        const customer = await stripe.customers.create({
          email: user.email,
          name: user.name,
          metadata: { userId: user._id.toString() },
        });
        console.log(customer, "customer==================>");

        customerId = customer.id;
        user.stripeCustomerId = customerId;
        await user.save();
      }

      const session = await stripe.checkout.sessions.create({
        mode: "subscription",
        payment_method_types: ["card"],
        line_items: [
          {
            price: PRICE_ID,
            quantity: 1,
          },
        ],
        // customer_email: email, // optional if you want to prefill
        success_url: `${process.env.WEB_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.WEB_URL}/cancel`,
        billing_address_collection: "required",
        // shipping_address_collection: {
        //   allowed_countries: ["US", "CA", "IN"], // or ['*'] for all countries
        // },
        customer: customerId,
      });
      console.log(session, "-=================>");
      return { url: session.url };
    } catch (error) {
      console.log(error);
      return error.message;
    }
  },

  successPaymentCheckout: async (data) => {
    const { session_id } = data;
    try {
      const session = await stripe.checkout.sessions.retrieve(session_id, {
        expand: ["subscription", "subscription.plan.product", "customer"],
      });
      console.log(session, "session");
      const customerDetails = session.customer_details;
      const subscriptionDetails = session.subscription;
      const billingAddress = customerDetails.address; // Includes: city, state, postal_code, country
      const email = customerDetails.email;
      const priceItem = subscriptionDetails.items.data[0].price;

      const user = await User.findOne({ email }); // or use your session/auth system

      if (user) {
        user.stripeCustomerId = session?.customer?.id;

        user.address = {
          country: billingAddress.country || "",
          state: billingAddress.state || "",
          city: billingAddress.city || "",
          pincode: billingAddress.postal_code || "",
        };
        user.isSubscribed = true;

        user.subscription = {
          id: subscriptionDetails.id,
          status: subscriptionDetails.status,
          start_date:
            new Date(subscriptionDetails.start_date * 1000).toISOString() ||
            new Date(),
          plan: {
            id: priceItem.id || "",
            currency: subscriptionDetails?.currency || "",
            interval: priceItem?.recurring.interval || "",
            interval_count: priceItem?.recurring?.interval_count || 0,
            amount: priceItem?.unit_amount / 100 || 0, // Stripe stores in cents
          },
        };

        await user.save();
        const data = {
          subscriptionId: subscriptionDetails.id,
          user: {
            name: user.name,
            email: user.email,
            subscription: user.subscription || null,
          },
        };

        return data;
      }
      return "subscripton user not found";
    } catch (error) {
      console.log(error);
      return error.message;
    }
  },
  customerPortalSession: async (data) => {
    const { customerId } = data;
    try {
      const session = await stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: `${process.env.WEB_URL}/account`,
      });
      console.log(session, "customer portal session");
      return { url: session.url };
    } catch (error) {
      console.log(error);
      return error.message;
    }
  },
  subscriptionManagerWebhook: async (req) => {
    // console.log(req.body, req.headers, "============>", "=====>webhook body");
    // const endingSeceret = process.env.STRIPE_WEBHOOK_SECRET;

    const sig = req.headers["stripe-signature"];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
      console.log(`Webhook signature verification failed: ${err.message}`);
      return;
    }

    // Handle the event
    switch (event.type) {
      // case "customer.subscription.updated":
      //   const subscription = event.data.object;
      //   console.log(subscription, "subscription updated");
      //   break;
      // case "customer.subscription.deleted":
      //   const deletedSubscription = event.data.object;
      //   console.log(deletedSubscription, "subscription deleted");
      //   break;
      case "checkout.session.completed":
        console.log("New Subscription started!");
        console.log(event.data);
        break;

      // Event when the payment is successfull (every subscription interval)
      case "invoice.paid":
        console.log("Invoice paid");
        console.log(event.data);
        break;

      // Event when the payment failed due to card problems or insufficient funds (every subscription interval)
      case "invoice.payment_failed":
        console.log("Invoice payment failed!");
        console.log(event.data);
        break;

      case "customer.subscription.deleted":
        console.log("Subscription was cancelled!");
        console.log(event.data,"=====>", event.data.object," ========>");
        break;

      // Event when subscription is updated
      case "customer.subscription.updated":
        console.log("Subscription updated!");
        // console.log(event.data.object);

         const subscription = event.data.object;
  const stripeCustomerId = subscription.customer;

  // Find the user by their Stripe customer ID
  const user = await User.findOne({ stripeCustomerId });

  if (!user) {
    console.error("User not found for Stripe customer ID:", stripeCustomerId);
    return " User not found for Stripe customer ID:";
   
  }
  const subscriptionItem = subscription.items?.data[0];
  const plan = subscriptionItem?.plan;

   user.subscription = {
    id: subscription.id,
    status: subscription.status,
    start_date: formatUnixTimestamp(subscription.start_date),
    cancel_at_period_end: subscription.cancel_at_period_end,
    canceled_at: formatUnixTimestamp(subscription.canceled_at),
    current_period_start: formatUnixTimestamp(subscriptionItem.current_period_start),
    current_period_end: formatUnixTimestamp(subscriptionItem.current_period_end),
    cancellation_details: {
      comment: subscription.cancellation_details?.comment || null,
      feedback: subscription.cancellation_details?.feedback || null,
      reason: subscription.cancellation_details?.reason || null,
    },
    plan: {
      id: plan?.id || null,
      currency: plan?.currency || null,
      interval: plan?.interval || null,
      interval_count: plan?.interval_count || null,
      amount: plan?.amount || null,
    },
  };

  // Update flags
   user.isSubscribed =  subscription.canceled_at?.toString() && subscription.cancel_at_period_end === false ? false : true;
  user.status = subscription.status;
  

     await user.save();
     console.log(user, user.subscription, "user updated with subscription details");
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
  },
};
