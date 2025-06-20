const router = require('express').Router();

const authenticateToken = require('../../helpers/middlewares/authenticateToken');
const {upload, uploadImg} = require('../../helpers/utils/multer.utils');
const { saveScreenshot ,getAllScreenshots, getAllScreenshotsById,deleteScreenshots} = require('./screenshort.controller');

router.post('/uploads', authenticateToken, uploadImg.array('files'), saveScreenshot);
// router.post('/uploads' , saveScreenshot);
router.get('/folders/all',authenticateToken, getAllScreenshots);
router.get('/images/all/:id',authenticateToken, getAllScreenshotsById);
router.delete(
  "/delete",
  authenticateToken,
  deleteScreenshots
);
// router.get('/:id', getUserById);
// router.put('/update/:id', updateUser);
// router.put('/change-password',authenticateToken, changePassword);

module.exports = router;