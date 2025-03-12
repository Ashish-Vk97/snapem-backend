const router = require('express').Router();

const authenticateToken = require('../../helpers/middlewares/authenticateToken');
const { createUser, getAllUsers, getUserById, updateUser, deleteUser } = require('./user.controller');

// router.post('/create', createUser);
router.get('/all',authenticateToken, getAllUsers);
router.get('/:id', getUserById);
router.put('/update/:id', updateUser);
// router.post('/change-password', changePassword);

module.exports = router;