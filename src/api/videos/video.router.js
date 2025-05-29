const router = require('express').Router();

const authenticateToken = require('../../helpers/middlewares/authenticateToken');
const upload = require('../../helpers/utils/multer.utils');
const {videoUpload, uploadVideo} = require('../../helpers/utils/video.multer');
const { saveSosVideos ,getAllSosVideos, getAllSosVideosById} = require('./video.controller');

router.post('/uploads',authenticateToken, uploadVideo.array('files', 10), saveSosVideos );
router.get('/sos/folders',authenticateToken, getAllSosVideos);
router.get('/sos/folders/videos/:id',authenticateToken, getAllSosVideosById);
// router.get('/sos/videos/:id',authenticateToken, getSosVideosById);
// router.get('/:id', getUserById);
// router.put('/update/:id', updateUser);
// router.put('/change-password',authenticateToken, changePassword);

module.exports = router;