const generateResponse = require('./response.format');

module.exports = {
    successResponse: (res, data, message="success") => {
        return generateResponse(res, true, message||"success", 200, data); 
    },
    servicefailureResponse: (res, message, data=null) => {
        return generateResponse(res, false, message||"failed", 404, data); 
    },
    badRequestResponse: (res, message, data=null) => {
        return generateResponse(res, false, message||"bad request", 400, data);
    },
    notFoundResponse: (res, message, data=null) => {
        return generateResponse(res, false, message||"failure", 404, data); 
    },
    authFailureResponse: (res, message, data=null) => {
        return generateResponse(res, false, message||"authentication failure", 403, data); 
    },
    internalFailureResponse:(res, message, data=null) => {
        return generateResponse(res, false, message||"Internal server error", 500, data); 
    },
    failedValidationResponse : (res, failure) => {
        return generateResponse(res, false,"Validation failed",400, failure.error.details[0].message); 
    },
     
};