const joi = require('joi');
const validations = require('../../helpers/global/validation.constants');

module.exports = {
    signUp: joi.object().keys({
            name:validations.string,
            email:validations.email,
            password:validations.password,
            phone:validations.phone,
            gender:validations.gender,
            role:validations.role.optional()
        
    }),
    signIn: joi.object().keys({
        email:validations.email,
        password:validations.password
    }),
    forgotPassword: joi.object().keys({
        email:validations.email,
        password:validations.password
        
    })
};
