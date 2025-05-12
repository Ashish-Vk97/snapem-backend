const response = require("../../helpers/utils/api-response/response.function");

// const { createSubscriptionPlan ,updateSubscriptionPlan } = require("./subscription.validation");
const service = require("./payment.service");


module.exports = {
    createPaymentCheckout: async (req,res)=>{
        try {
            const PRICE_ID = 'price_1RM5p1RZYaMpUn5U4PGsLSlo';
            const data = {PRICE_ID,email:"ashishsahoo00855@gmail.com"}
             
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
    }
}