const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

module.exports = {
    createPaymentCheckout: async (data)=>{
        try {
            const {PRICE_ID,email} =data
            const session = await stripe.checkout.sessions.create({
                mode: 'subscription',
                payment_method_types: ['card'],
                line_items: [
                  {
                    price: PRICE_ID,
                    quantity: 1,
                  },
                ],
                customer_email: email, // optional if you want to prefill
                success_url: `${process.env.WEB_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: `${process.env.WEB_URL}/cancel`,
              });
          console.log(session,"-=================>")
              return { url: session.url};
            
        } catch (error) {
            console.log(error)
            return error.message;
            
        }
    }
}