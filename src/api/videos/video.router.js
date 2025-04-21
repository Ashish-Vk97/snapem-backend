const router = require('express').Router();

const authenticateToken = require('../../helpers/middlewares/authenticateToken');
const upload = require('../../helpers/utils/multer.utils');
const videoUpload = require('../../helpers/utils/video.multer');
const { saveSosVideos ,getAllSosVideos} = require('./video.controller');

router.post('/uploads',authenticateToken, videoUpload.array('files', 10), saveSosVideos);
router.get('/sos/all',authenticateToken, getAllSosVideos);
// router.get('/:id', getUserById);
// router.put('/update/:id', updateUser);
// router.put('/change-password',authenticateToken, changePassword);

module.exports = router;