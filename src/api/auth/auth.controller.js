const User = require("../users/schemas/user.schema");
const response = require("../../helpers/utils/api-response/response.function");
const service = require("./auth.service");
const authValidation = require("./auth.validation");

module.exports = {
  signIn: async (req, res) => {
    try {
      const data = req.body;
      const failure = authValidation.signIn.validate(data);
      if (failure.error) {
        return response.failedValidationResponse(res, failure, null);
      }

      const result = await service.signIn(data,req);
      if (result && typeof result !== "string") {
        return response.successResponse(res, result);
      }
      return response.servicefailureResponse(res, result);
    } catch (error) {
      return response.internalFailureResponse(res, error.message);
    }
  },
  signUp: async (req, res) => {
    try {
      const data = req.body;
      const failure = authValidation.signUp.validate(data);

      console.log(failure.error, "failure.error");
       
      
      if (failure.error) {  
        return response.failedValidationResponse(res, failure, null);
      }

      const result = await service.signUp(data);

      if (result && typeof result !== "string") {
        return response.successResponse(
          res,
          result,
          "User created successfully"
        );
      }
      return response.servicefailureResponse(res, result);
    } catch (error) {
      console.log("error", error);
      return response.internalFailureResponse(res, error.message);
    }
  },
  forgotPassword: async (req, res) => { 
    try {
      const data = req.body;
      const failure = authValidation.forgotPassword.validate(data);
      if (failure.error) {
        return response.failedValidationResponse(res, failure, null);
      }

      const result = await service.forgotPassword(data?.email);
      if (result && typeof result !== "string") {
        return response.successResponse(res, result,"Password reset link has been sent to your mail!" );
      }
      return response.servicefailureResponse(res, result);
    } catch (error) {
      return response.internalFailureResponse(res, error.message);
    }
  },
  
  
};
