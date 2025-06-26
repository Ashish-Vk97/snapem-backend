const SubscriptionPlan = require("./schemas/subscription.schema");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

module.exports ={
    createSubscriptionPlan: async (req ) => {
        const data = req.body;
        try {

          const product = await stripe.products.create({
            name: data?.cardType,
            description: data?.description || '',
          });
      
          // 2. Create Stripe Price (Recurring)
          const priceInCents = Math.round(data?.price * 100);
          let interval, interval_count;

          switch (data?.duration) {
            case 1: // Monthly
              interval = 'month';
              interval_count = 1;
              break;
            case 2: // Quarterly (every 6 months)
              interval = 'month';
              interval_count = 6;
              break;
            case 3: // Yearly
              interval = 'year';
              interval_count = 1;
              break;
            default:
              throw new Error("Invalid duration value");
          }
          
          const stripePrice = await stripe.prices.create({
            unit_amount: priceInCents,
            currency: data?.currency?.toLowerCase() || 'usd',
            recurring: {
              interval,
              interval_count,
            },
            product: product.id,
          });
            console.log(product, stripePrice,"product====================>");
        //    const subscriptionPlan = await SubscriptionPlan.create(data)
           const newPlan = new SubscriptionPlan({...data, stripeProductId: product.id, stripePriceId: stripePrice.id});
           const subscriptionDetails = await newPlan.save();
            
            if (!subscriptionDetails) {
                return "Subscription Plan not created";
            } 

            return subscriptionDetails;

            
        } catch (error) {
            console.error("Error creating subscription plan:", error);
            return error.message ;
            
        }
    },
  getAllSubscriptionPlans: async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    try {
      const startIndex = (page - 1) * limit;
      const subscriptionPlans = await SubscriptionPlan.find()
        .limit(limit)
        .skip(startIndex)
        .sort({ createdAt: 1 });

      if (subscriptionPlans.length > 0) {
        return subscriptionPlans;
      }
      return "Subscription plans not found";
    } catch (error) {
      return error.message;
    }
  },
  // updateSubscriptionPlanById: async (req) => {
  //   const { id } = req.params;
  //   const data = req.body;
  //   try {
  //     const updatedPlan = await SubscriptionPlan.findByIdAndUpdate(
  //       id,
  //       { $set: { ...data } },
  //       { new: true }
  //     );
  //     if (!updatedPlan) {
  //       return "Subscription Plan not found";
  //     }
  //     return updatedPlan;
  //   } catch (error) {
  //     return error.message;
  //   }
  // },
  updateSubscriptionPlanById: async (req) => {
  const { id } = req.params;
  const data = req.body;

  try {
    // 1. Fetch existing plan from DB
    const existingPlan = await SubscriptionPlan.findById(id);
    if (!existingPlan) {
      return "Subscription Plan not found";
    }

    // 2. Update Stripe Product (name/description)
    await stripe.products.update(existingPlan.stripeProductId, {
      name: data?.cardType,
      description: data?.description || '',
    });

    // 3. Deactivate old Stripe Price
    if (existingPlan.stripePriceId) {
      await stripe.prices.update(existingPlan.stripePriceId, {
        active: false,
      });
    }

    // 4. Create a new Stripe Price
    const priceInCents = Math.round(data?.price * 100);
    let interval, interval_count;

    switch (data?.duration) {
      case 1:
        interval = 'month';
        interval_count = 1;
        break;
      case 2:
        interval = 'month';
        interval_count = 6;
        break;
      case 3:
        interval = 'year';
        interval_count = 1;
        break;
      default:
        throw new Error("Invalid duration value");
    }

    const newStripePrice = await stripe.prices.create({
      unit_amount: priceInCents,
      currency: data?.currency?.toLowerCase() || 'usd',
      recurring: {
        interval,
        interval_count,
      },
      product: existingPlan.stripeProductId,
    });
  console.log(newStripePrice)
    // 5. Update MongoDB document with new Stripe Price ID
    const updatedPlan = await SubscriptionPlan.findByIdAndUpdate(
      id,
      {
        $set: {
          ...data,
          stripePriceId: newStripePrice.id,
        },
      },
      { new: true }
    );

    return updatedPlan;

  } catch (error) {
    console.error("Error updating subscription plan:", error);
    return error.message;
  }
},

  getSubscriptionById: async (req) => {
    const { id } = req.params;
    try {
      const subscriptionPlan = await SubscriptionPlan.findById(id).select("-__v ");
      if (!subscriptionPlan) {
        return "Subscription Plan not found";
      }
      return subscriptionPlan;
    } catch (error) {
      return error?.message;
    }
},
deleteSubscriptionPlanById: async (req) => {
    const { id } = req.params;
    try {
      const deletedPlan = await SubscriptionPlan.findByIdAndDelete(id);
      if (!deletedPlan) {
        return "Subscription Plan not found";
      }
      return deletedPlan;
    } catch (error) {
      return error.message;
    }
  }
      
}