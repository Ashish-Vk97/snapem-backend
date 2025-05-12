const Joi = require('joi');
const validations = require('../../helpers/global/validation.constants');

module.exports = {
    createSubscriptionPlan: Joi.object().keys({
        cardType: Joi.string().valid('basic', 'standard', 'premium').required(),
        price: Joi.number().min(0).required(),
        duration: Joi.number().integer().min(1).required(),
        currency: Joi.string().default('usd'),
        
        perks: Joi.array().items(Joi.string()).default([]),
        isRecurring: Joi.boolean().default(true),
        maxUsers: Joi.number().integer().min(1),
        description: Joi.string().allow('', null),
    }),
    updateSubscriptionPlan: Joi.object().keys({
        cardType: Joi.string().valid('basic', 'standard', 'premium'),
        price: Joi.number().min(0),
        duration: Joi.number().integer().min(1),
        currency: Joi.string().default('usd'),
        perks: Joi.array().items(Joi.string()).default([]),
        isRecurring: Joi.boolean().default(true),
        maxUsers: Joi.number().integer().min(1),
        description: Joi.string().allow('', null),
    })
}