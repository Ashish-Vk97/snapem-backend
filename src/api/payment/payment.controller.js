const response = require("../../helpers/utils/api-response/response.function");

// const { createSubscriptionPlan ,updateSubscriptionPlan } = require("./subscription.validation");
const service = require("./payment.service");

module.exports = {
  createPaymentCheckout: async (req, res) => {
    try {
      // const PRICE_ID = 'price_1RMqLIRZYaMpUn5UXTKf4JUe';
      //  price_1RMqLIRZYaMpUn5UXTKf4JUe
      //  price_1RMqLIRZYaMpUn5UXTKf4JUe

      const { PRICE_ID } = req.body;
      const { id: userId, email, name } = req.user;
      const data = { PRICE_ID, email, userId };
      console.log(data, "data======>");

      const result = await service.createPaymentCheckout(data);

      if (result && typeof result !== "string") {
        return response.successResponse(
          res,
          result,
          "payment done successfully"
        );
      }
      return response.servicefailureResponse(res, result);
    } catch (error) {
      console.error("Error creating payment internal issue:", error);
      return response.internalFailureResponse(res, error.message);
    }
  },
  successPaymentCheckout: async (req, res) => {
    try {
      const { session_id } = req.query;

      const result = await service.successPaymentCheckout({ session_id });

      if (result && typeof result !== "string") {
        return response.successResponse(
          res,
          result,
          "payment done success successfully"
        );
      }
      return response.servicefailureResponse(res, result);
    } catch (error) {
      console.error("Error creating payment success internal issue:", error);
      return response.internalFailureResponse(res, error.message);
    }
  },
  customerPortalSession: async (req, res) => {
    try {
      const { customerId } = req.params;

      const result = await service.customerPortalSession({ customerId });

      if (result && typeof result !== "string") {
        return response.successResponse(
          res,
          result,
          "Customer portal url fetched successfully"
        );
      }
      return response.servicefailureResponse(res, result);
    } catch (error) {
      console.error("Error creating payment success internal issue:", error);
      return response.internalFailureResponse(res, error.message);
    }
  },
  subscriptionManagerWebhook: async (req, res) => {
    try {
      // const event = req.body;

      const result = await service.subscriptionManagerWebhook(req);

      if (result && typeof result !== "string") {
        return response.successResponse(
          res,
          result,
          "Customer portal url fetched successfully"
        );
      }
      return response.servicefailureResponse(res, result);
    } catch (error) {
      console.error("Error creating payment success internal issue:", error);
      return response.internalFailureResponse(res, error.message);
    }
  },
};
