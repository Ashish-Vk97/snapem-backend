const router = require('express').Router();

router.use('/test', (req, res) => {
   return res.status(200).json({message: 'Test API'});
});
           
router.use('/auth', require('./auth/auth.router'));
router.use('/users', require('./users/user.router'));
router.use('/screenshot', require('./screenshots/screenshot.router'));
router.use('/emergency', require('./emergency/emergency_contact.router'));
router.use('/video', require('./videos/video.router'));
router.use('/subscription', require('./subscription/subscription.router'));

module.exports = router;