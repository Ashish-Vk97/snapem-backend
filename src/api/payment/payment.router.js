const router = require('express').Router();

const authenticateToken = require('../../helpers/middlewares/authenticateToken');
const { createPaymentCheckout } = require('./payment.controller');


router.post('/create-checkout-session', createPaymentCheckout);
// router.get('/all', getAllSubscriptionPlans);
// router.get('/:id', getSubscriptionById);
// router.put('/update/:id', updateSubscriptionPlanById);
// router.delete('/delete/:id', deleteSubscriptionPlanById);


module.exports = router;