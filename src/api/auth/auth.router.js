const router = require('express').Router();
const controller = require('./auth.controller');

router.post('/login',controller.signIn);
router.post('/signup',controller.signUp);
router.post('/forgot-password',controller.forgotPassword); 

module.exports = router;