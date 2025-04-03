const { create } = require("./schemas/emergency_contact.schema");
const emergencyValidation = require("./emergency_contact.validation");
const service = require("./emergency_contact.service"); 
const responseFormat = require("../../helpers/utils/api-response/response.function");
const User = require("../users/schemas/user.schema");

module.exports={
    createEmergencyContact: async (req, res) => {
         try {
                   const data = req.body;
                   console.log(data, 'data======>');
       
                   const failure = emergencyValidation.createEmergencyContact.validate(data);
                   if (failure.error) {
                       return responseFormat.failedValidationResponse(res, failure, null);
                   }        
       
                   const result = await service.createEmergencyContact(req);
       
                   if( result && typeof result !== 'string'){
                    // const users = await User.find()
                    // .populate('emergencyContacts') // Populate the emergencyContacts field with data
                    // .exec();
                         
                        return responseFormat.successResponse(res, result, 'Emergency contact created successfully');   
                   }       
                    return responseFormat.servicefailureResponse(res, result);
       
               } catch (error) {
                   return responseFormat.internalFailureResponse(res, error.message);
               } 
    },
    getAllEmergencyContacts: async (req,res) => {
        
        try {
                   console.log(req.user, 'req.user');
                   const result = await service.getAllEmergencyContacts(req);
       
                   if( result && typeof result !== 'string'){
       
                       return responseFormat.successResponse(res, result, 'Your emergency contact fetched successfully');   
                   }
                    return responseFormat.servicefailureResponse(res, result);
       
               } catch (error) {
                   return responseFormat.internalFailureResponse(res, error.message);
               } 
    },
    getEmergencyById: async (req,res) => {
    
       try {
                  const result = await service.getEmergencyById(req);
      
                  console.log(result, 'result');
      
                  if( result && typeof result !== 'string'){  
      
                      return responseFormat.successResponse(res, result, 'Emergency contact details fetched successfully');   
                  }
                   return responseFormat.servicefailureResponse(res, result);
      
              } catch (error) {
                  return responseFormat.internalFailureResponse(res, error.message);
              }  
    },
    updateEmergencyById: async (req,res) => {
        try {
            const data = req.body;
            console.log(data, 'data======>');

            const failure = emergencyValidation.updateEmergencyContact.validate(data);
            if (failure.error) {
                return responseFormat.failedValidationResponse(res, failure, null);
            }        

            const result = await service.updateEmergencyById(req);

            if( result && typeof result !== 'string'){
             // const users = await User.find()
             // .populate('emergencyContacts') // Populate the emergencyContacts field with data
             // .exec();
                  
                 return responseFormat.successResponse(res, result, 'Emergency contact updated successfully');   
            }       
             return responseFormat.servicefailureResponse(res, result);

        } catch (error) {
            return responseFormat.internalFailureResponse(res, error.message);
        } 
    },
    deleteEmergencyContact: async (req,res) => {
        try {
            const result = await service.deleteEmergencyContact(req);

            console.log(result, 'result');

            if( result && typeof result !== 'string'){  

                return responseFormat.successResponse(res, result, 'Emergency contact details deleted successfully');   
            }
             return responseFormat.servicefailureResponse(res, result);

        } catch (error) {
            return responseFormat.internalFailureResponse(res, error.message);
        }  
    },
}