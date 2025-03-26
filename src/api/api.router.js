const router = require('express').Router();

router.use('/test', (req, res) => {
   return res.status(200).json({message: 'Test API'});
});
           
router.use('/auth', require('./auth/auth.router'));
router.use('/users', require('./users/user.router'));
router.use('/screenshot', require('./screenshots/screenshot.router'));

module.exports = router;