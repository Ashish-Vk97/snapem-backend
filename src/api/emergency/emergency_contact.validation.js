const joi = require('joi');
const validations = require('../../helpers/global/validation.constants');


module.exports = {
    createEmergencyContact: joi.object().keys({
                name:validations.string,
                email:joi.string().email().allow("").optional(),  
                phone:validations.phone,
               
            
        }),
        updateEmergencyContact: joi.object().keys({
            name:validations.string.optional(),
            email:joi.string().email().allow("").optional(),
            phone:validations.phone.optional(),
          
        }),
       
};