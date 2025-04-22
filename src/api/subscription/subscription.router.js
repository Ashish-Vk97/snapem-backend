const router = require('express').Router();

const authenticateToken = require('../../helpers/middlewares/authenticateToken');
const { createSubscriptionPlan, getAllUsers, getUserById, updateUser,changePassword } = require('./subscription.controller');

router.post('/create', createSubscriptionPlan);
// router.get('/all',authenticateToken, getAllUsers);
// router.get('/:id', getUserById);
// router.put('/update/:id', updateUser);


module.exports = router;