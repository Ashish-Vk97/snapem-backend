const response = require("../../helpers/utils/api-response/response.function");
const SubscriptionPlan = require("./schemas/subscription.schema");
const { createSubscriptionPlan ,updateSubscriptionPlan } = require("./subscription.validation");
const service = require("./subscription.service");

module.exports = {
  createSubscriptionPlan: async (req, res) => {
    try {
      const data = req.body;
      const failure = createSubscriptionPlan.validate(data);
      if (failure.error) {
        return response.failedValidationResponse(res, failure, null);
      }

      // Check if the plan already exists
      const existingPlan = await SubscriptionPlan.findOne({ cardType: data.cardType });
      if (existingPlan) {
        return response.servicefailureResponse(
          res,
          "Subscription Plan already exists",
          null
        );
      }

      const result = await service.createSubscriptionPlan(req);

      if (result && typeof result !== "string") {
        return response.successResponse(
          res,
          result,
          "subscription plan created  successfully"
        );
      }
      return response.servicefailureResponse(res, result);
    } catch (error) {
      console.error("Error creating subscription plan:", error);
      return response.internalFailureResponse(res, error.message);
    }
  },
  getAllSubscriptionPlans: async (req, res) => {
    try {
      const result = await service.getAllSubscriptionPlans(req);

      if (result && typeof result !== "string") {
        return response.successResponse(res, result, "Subscription plans fetched successfully");
      }
      return response.servicefailureResponse(res, result);
    } catch (error) {
      return response.internalFailureResponse(res, error.message);
    }
  },
  updateSubscriptionPlanById: async (req, res) => {
    try {
      const data = req.body;
      const planId = req.params.id; // Assuming you're passing the plan ID in the URL

      const failure = updateSubscriptionPlan.validate(data);
      if (failure.error) {
        return response.failedValidationResponse(res, failure, null);
      }

      const result = await service.updateSubscriptionPlanById(req, planId);

      if (result && typeof result !== "string") {
        return response.successResponse(
          res,
          result,
          "Subscription plan updated successfully"
        );
      }
      return response.servicefailureResponse(res, result);
    } catch (error) {
      console.error("Error updating subscription plan:", error);
      return response.internalFailureResponse(res, error.message);
    }
  },
  getSubscriptionById: async (req, res) => {
    try {
      const planId = req.params.id; // Assuming you're passing the plan ID in the URL

      const result = await service.getSubscriptionById(req, planId);

      if (result && typeof result !== "string") {
        return response.successResponse(res, result, "Subscription plan fetched successfully");
      }
      return response.servicefailureResponse(res, result);
    } catch (error) {
      console.error("Error fetching subscription plan:", error);
      return response.internalFailureResponse(res, error.message);
    }
  },
  deleteSubscriptionPlanById: async (req, res) => {
    try {
      const planId = req.params.id; // Assuming you're passing the plan ID in the URL

      const result = await service.deleteSubscriptionPlanById(req, planId); 

      if (result && typeof result !== "string") {
        return response.successResponse(res, result, "Subscription plan deleted successfully");
      }
      return response.servicefailureResponse(res, result);
    }catch (error) {
      console.error("Error deleting subscription plan:", error);
      return response.internalFailureResponse(res, error.message);
    }
  }

};
