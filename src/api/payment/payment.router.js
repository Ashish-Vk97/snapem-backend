const router = require('express').Router();
const express = require('express');

const authenticateToken = require('../../helpers/middlewares/authenticateToken');
const { createPaymentCheckout, successPaymentCheckout,customerPortalSession, subscriptionManagerWebhook } = require('./payment.controller');


router.post('/create-checkout-session',authenticateToken, createPaymentCheckout);
router.get('/success', successPaymentCheckout);
router.get('/customerportal/:customerId', customerPortalSession);
// router.post('/webhook',express.raw({type: 'application/json'}), subscriptionManagerWebhook);

// router.get('/all', getAllSubscriptionPlans);
// router.get('/:id', getSubscriptionById);
// router.put('/update/:id', updateSubscriptionPlanById);
// router.delete('/delete/:id', deleteSubscriptionPlanById);


module.exports = router;