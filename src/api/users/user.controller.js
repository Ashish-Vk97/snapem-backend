const User = require('./schemas/user.schema');
const service = require('./user.service');
const updateUserValidation = require('./user.validation');
const response = require('../../helpers/utils/api-response/response.function');
const userValidation = require('./user.validation');

module.exports = { 
    getAllUsers:async (req, res) => {
        try {
            console.log(req.user, 'req.user');
            const result = await service.getAllUsers(req);

            if( result && typeof result !== 'string'){

                return response.successResponse(res, result, 'Users fetched successfully');   
            }
             return response.servicefailureResponse(res, result);

        } catch (error) {
            return response.internalFailureResponse(res, error.message);
        }  
    },
    getUserById:async (req, res) => { 
        try {
            const result = await service.getUserById(req);

            console.log(result, 'result');

            if( result && typeof result !== 'string'){  

                return response.successResponse(res, result, 'User fetched successfully');   
            }
             return response.servicefailureResponse(res, result);

        } catch (error) {
            return response.internalFailureResponse(res, error.message);
        }  
    },

    updateUser:async (req, res) => {    
        try {
            const data = req.body;

            const failure = userValidation.updateUser.validate(data);
            if (failure.error) {
                return response.failedValidationResponse(res, failure, null);
            }        

            const result = await service.updateUser(req);

            if( result && typeof result !== 'string'){

                return response.successResponse(res, result, 'User updated successfully');   
            }       
             return response.servicefailureResponse(res, result);

        } catch (error) {
            return response.internalFailureResponse(res, error.message);
        }  
    },
    changePassword:async (req, res) => {
        try {
            const data = req.body;

            const failure = userValidation.changePassword.validate(data);
            if (failure.error) {
                return response.failedValidationResponse(res, failure, null);
            }        

            const result = await service.changePassword(req);

            if( result && typeof result !== 'string'){

                return response.successResponse(res, result, 'Password changed successfully');   
            }       
             return response.servicefailureResponse(res, result);

        } catch (error) {
            console.log(error.message, 'error');
            return response.internalFailureResponse(res, error.message);
        }  
    }
 };