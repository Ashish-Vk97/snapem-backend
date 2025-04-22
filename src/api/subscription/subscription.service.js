const SubscriptionPlan = require("./schemas/subscription.schema");

module.exports ={
    createSubscriptionPlan: async (req ) => {
        const data = req.body;
        try {
            
        //    const subscriptionPlan = await SubscriptionPlan.create(data)
           const newPlan = new SubscriptionPlan(data);
           const subscriptionDetails = await newPlan.save();
            
            if (!subscriptionDetails) {
                return "Subscription Plan not created";
            } 

            return subscriptionDetails;

            
        } catch (error) {
            console.error("Error creating subscription plan:", error);
            return response.internalFailureResponse(res, error.message);
            
        }
    }
      
}