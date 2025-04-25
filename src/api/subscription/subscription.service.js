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
        .sort({ createdAt: -1 });

      if (subscriptionPlans.length > 0) {
        return subscriptionPlans;
      }
      return "Subscription plans not found";
    } catch (error) {
      return error.message;
    }
  },
  updateSubscriptionPlanById: async (req) => {
    const { id } = req.params;
    const data = req.body;
    try {
      const updatedPlan = await SubscriptionPlan.findByIdAndUpdate(
        id,
        { $set: { ...data } },
        { new: true }
      );
      if (!updatedPlan) {
        return "Subscription Plan not found";
      }
      return updatedPlan;
    } catch (error) {
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