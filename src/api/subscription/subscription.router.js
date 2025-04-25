const router = require('express').Router();

const authenticateToken = require('../../helpers/middlewares/authenticateToken');
const { createSubscriptionPlan,updateSubscriptionPlanById,getSubscriptionById, getAllSubscriptionPlans,deleteSubscriptionPlanById } = require('./subscription.controller');


router.post('/create', createSubscriptionPlan);
router.get('/all', getAllSubscriptionPlans);
router.get('/:id', getSubscriptionById);
router.put('/update/:id', updateSubscriptionPlanById);
router.delete('/delete/:id', deleteSubscriptionPlanById);


module.exports = router;