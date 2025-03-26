const multer = require('multer');
const path = require('path');
const fs = require('fs');


const localUploadDir = './src/uploads/';
if (process.env.NODE_ENV !== 'production') {
    console.log(!fs.existsSync(localUploadDir), 'localUploadDir');
    if (!fs.existsSync(localUploadDir)) {
        fs.mkdirSync(localUploadDir, { recursive: true });
    }
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
    //   cb(null, './src/uploads/');
    const uploadDir = process.env.NODE_ENV === 'production' ? '/tmp' : localUploadDir; // Local environment: ./uploads, hosted: /tmp/uploads
    cb(null, uploadDir);
       // Save the files to the 'uploads' folder
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname)); // Rename the file to avoid conflicts
    }
  });
  
  const upload = multer({ storage: storage, limits: { fileSize: 50 * 1024 * 1024 }, });
  module.exports = upload;