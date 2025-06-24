const router = require('express').Router();

const authenticateToken = require('../../helpers/middlewares/authenticateToken');
const {  getAllUsers, getUserById, updateUser,changePassword, updateUserStatus, userFreeAccess, getAllUsersCount } = require('./user.controller');

// router.post('/create', createUser);
router.get('/all',authenticateToken, getAllUsers);
router.get('/users-count',getAllUsersCount);
router.get('/:id', getUserById);
router.put('/update/:id', updateUser);
router.put('/change-password',authenticateToken,changePassword);
router.put('/active-status/:userId',authenticateToken,updateUserStatus);
router.put('/free-access/:userId',authenticateToken,userFreeAccess);


module.exports = router;

