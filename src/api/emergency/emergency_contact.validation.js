const joi = require('joi');
const validations = require('../../helpers/global/validation.constants');


module.exports = {
    createEmergencyContact: joi.object().keys({
                name:validations.string,
                email:validations.email,
                phone:validations.phone,
               
            
        }),
        updateEmergencyContact: joi.object().keys({
            name:validations.string.optional(),
            email:validations.email.optional(),
            phone:validations.phone.optional(),
          
        }),
       
};