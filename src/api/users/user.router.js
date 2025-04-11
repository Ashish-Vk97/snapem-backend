const router = require('express').Router();

const authenticateToken = require('../../helpers/middlewares/authenticateToken');
const {  getAllUsers, getUserById, updateUser,changePassword } = require('./user.controller');

// router.post('/create', createUser);
router.get('/all',authenticateToken, getAllUsers);
router.get('/:id', getUserById);
router.put('/update/:id', updateUser);
router.put('/change-password',authenticateToken,changePassword);

module.exports = router;