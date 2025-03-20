const joi = require('joi');

module.exports = {
  
    array:joi.array().required(),
    object:joi.object().required(),
    string:joi.string().required(),
    boolean:joi.boolean().required(),
    date:joi.date().required(),
    number:joi.number().required(),
    // role:joi.string().valid('admin','user').required(),
    role:joi.string().valid('ADMIN','USER').required(),
    email:joi.string().email().required().min(5).max(100),
    password:joi.string().required().min(5).max(100),
    phone:joi.string().required().min(10).max(10),
    gender:joi.string().valid('M','F','O').required().messages({
            'string.base': 'Gender must be a string.',
            'any.only': 'Gender must be one of the following: male, female, or other.',
            'any.required': 'Gender is required.'
          })
 
}