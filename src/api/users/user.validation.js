const joi = require('joi');
const validations = require('../../helpers/global/validation.constants');
const { changePassword } = require('./user.controller');

module.exports = {
    createUser: joi.object().keys({
                name:validations.string,
                email:validations.email,
                password:validations.password,
                phone:validations.phone,
                gender:validations.gender,
                role:validations.role
            
        }),
        updateUser: joi.object().keys({
            name:validations.string.allow("").optional(),
            email:validations.email.allow("").optional(),
            password:validations.password.allow("").optional(),
            phone:validations.phone.allow("").optional(),
            gender:validations.gender.allow("").optional(),
            role:validations.role.allow("").optional()
        }),
        changePassword: joi.object().keys({
            
            password:validations.password,
            confirm_password:validations.password,
           
        }),
};