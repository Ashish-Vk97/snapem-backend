const response = require("../../helpers/utils/api-response/response.function");
const SubscriptionPlan = require("./schemas/subscription.schema");
const { createSubscriptionPlan } = require("./subscription.validation");
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
      const existingPlan = await SubscriptionPlan.findOne({ cardType });
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
};
