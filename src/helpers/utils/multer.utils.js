const multer = require('multer');
const path = require('path');


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, './src/uploads/'); // Save the files to the 'uploads' folder
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname)); // Rename the file to avoid conflicts
    }
  });
  
  const upload = multer({ storage: storage, limits: { fileSize: 50 * 1024 * 1024 }, });
  module.exports = upload;