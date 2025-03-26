const router = require('express').Router();

const authenticateToken = require('../../helpers/middlewares/authenticateToken');
const upload = require('../../helpers/utils/multer.utils');
const { saveScreenshot ,getAllScreenshots} = require('./screenshort.controller');

router.post('/uploads', upload.array('files', 10), saveScreenshot);
router.get('/images/all', getAllScreenshots);
// router.get('/:id', getUserById);
// router.put('/update/:id', updateUser);
// router.put('/change-password',authenticateToken, changePassword);

module.exports = router;