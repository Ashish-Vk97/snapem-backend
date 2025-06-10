const User = require("./schemas/user.schema");
const service = require("./user.service");
const updateUserValidation = require("./user.validation");
const response = require("../../helpers/utils/api-response/response.function");
const userValidation = require("./user.validation");

module.exports = {
  getAllUsers: async (req, res) => {
    try {
      console.log(req.user, "req.user");
      const result = await service.getAllUsers(req);

      if (result && typeof result !== "string") {
        return response.successResponse(
          res,
          result,
          "Users fetched successfully"
        );
      }
      return response.servicefailureResponse(res, result);
    } catch (error) {
      return response.internalFailureResponse(res, error.message);
    }
  },
  getUserById: async (req, res) => {
    try {
      const result = await service.getUserById(req);

      console.log(result, "result");

      if (result && typeof result !== "string") {
        return response.successResponse(
          res,
          result,
          "User fetched successfully"
        );
      }
      return response.servicefailureResponse(res, result);
    } catch (error) {
      return response.internalFailureResponse(res, error.message);
    }
  },

  updateUser: async (req, res) => {
    try {
      const data = req.body;
      console.log(data, "updateUser data");

      const failure = userValidation.updateUser.validate(data);
      if (failure.error) {
        return response.failedValidationResponse(res, failure, null);
      }

      const result = await service.updateUser(req);

      if (result && typeof result !== "string") {
        return response.successResponse(
          res,
          result,
          "User updated successfully"
        );
      }
      return response.servicefailureResponse(res, result);
    } catch (error) {
      return response.internalFailureResponse(res, error.message);
    }
  },
  changePassword: async (req, res) => {
    try {
      const data = req.body;
      // console.log(`${TAG}.changePassword: `, data);

      const failure = userValidation.changePassword.validate(data);
      if (failure.error) {
        return response.failedValidationResponse(res, failure);
      }

      const result = await service.changePassword(req?.user?.id, data.password);

      if (result === data.password) {
        return response.servicefailureResponse(
          res,
          "You've entered an old password! Please try again."
        );
      }

      if (result) {
        return response.successResponse(
          res,
          result,
          "New password updated successfully"
        );
      }

      return response.servicefailureResponse(res);
    } catch (error) {
      console.log(error);
      //   logger.error(`Change password failed: ${error.message}`);
      return response.internalFailureResponse(res, error);
    }
  },
  updateUserStatus: async (req, res) => {
    try {
      const userId = req.params.userId;
      const status = req.body.status;
      console.log(`updateUserStatus: `, userId);

      const failure = userValidation.updateUserStatus.validate({
        userId: userId,
        status: req.body.status,
      });
      console.log(failure, "failure");
      if (failure.error) {
        return response.failedValidationResponse(res, failure);
      }

      const result = await service.updateUserStatus(userId, status);

      if (result && typeof result !== "string") {
        return response.successResponse(
          res,
          result,
          "User status updated successfully"
        );
      }
      return response.servicefailureResponse(res, result);
    } catch (error) {
      console.log(error);
      //   logger.error(`Change password failed: ${error.message}`);
      return response.internalFailureResponse(res, error);
    }
  },
};
