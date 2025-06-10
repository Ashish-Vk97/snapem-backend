const joi = require("joi");
const validations = require("../../helpers/global/validation.constants");
const { changePassword } = require("./user.controller");
const { validate } = require("./schemas/user.schema");
const Joi = require("joi");

module.exports = {
  createUser: joi.object().keys({
    name: validations.string,
    email: validations.email,
    password: validations.password,
    phone: validations.phone,
    gender: validations.gender,
    role: validations.role,
    // address:validate.object().keys({

    //     city: validations.string.allow("").optional(),
    //     state: validations.string.allow("").optional(),
    //     country: validations.string.allow("").optional(),
    //     pincode: validations.string.allow("").optional()
    // }).optional()
  }),
  updateUser: joi.object().keys({
    name: validations.string.allow("").optional(),
    email: validations.email.allow("").optional(),
    password: validations.password.allow("").optional(),
    phone: validations.phone.allow("").optional(),
    gender: validations.gender.allow("").optional(),
    role: validations.role.allow("").optional(),
    address: Joi
      .object()
      .keys({
        city: validations.string,
        state: validations.string, 
        country: validations.string,
        pincode: validations.string.allow(""),
      })
      .optional(), 
  }),
  changePassword: joi.object().keys({
    password: validations.password,
    // confirm_password:validations.password,
  }),
  updateUserStatus: joi.object().keys({
    status: joi
      .string()
      .valid("inactive", "active")
      .required()
      .messages({
        "any.only": "Status must be either 'inactive' or 'active'",
        "any.required": "Status is required",
      }),
       userId: validations.string.allow("").optional()

  }),

 
};
