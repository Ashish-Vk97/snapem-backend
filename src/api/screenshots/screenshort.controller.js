const response = require('../../helpers/utils/api-response/response.function');
const path = require('path');
const fs = require('fs').promises;

module.exports ={
    saveScreenshot: async (req, res) => {
        try {
            const file = req.files;
            // console.log(file,"file====>")
            if (!file.length > 0) {
                return response.servicefailureResponse(res, "No files uploaded");
                
            }
           return  response.successResponse(res, null, 'file uploaded successfully'); 
        } catch (error) {
            return response.internalFailureResponse(res, error.message);
        }
    },
    getAllScreenshots: async (req, res) => {
        try {
            const uploadDir = path.join(__dirname, '..',"..", 'uploads');

        //   console.log( path.join(__dirname, '..',"..", 'uploads'), '==========>');
          
   
          const files = await fs.readdir(uploadDir);
      
          // Generate full file paths
          const filePaths = files.map(file => `/uploads/${file}`);
        
          // Send the list of file paths back as a JSON response
          if (!filePaths.length >0) {
            return response.servicefailureResponse(res, "No files uploaded");
          }
          const result ={
                message: 'All screenshots fetched successfully',
                images: filePaths
          }
         return  response.successResponse(res, result, 'file uploaded successfully'); 
        
        } catch (error) {
          // Handle errors
          return response.internalFailureResponse(res, error.message);
        }
      },
    // getScreenshotById: async (req, res) => {
    //     try {
    //         return res.status(200).json({ message: 'Screenshot fetched successfully' });
    //     } catch (error) {
    //         return res.status(500).json({ message: error.message });
    //     }
    // },
    // updateScreenshot: async (req, res) => {
    //     try {
    //         return res.status(200).json({ message: 'Screenshot updated successfully' });
    //     } catch (error) {
    //         return res.status(500).json({ message: error.message });
    //     }
    // },
    // deleteScreenshot: async (req, res) => {
    //     try {
    //         return res.status(200).json({ message: 'Screenshot deleted successfully' });
    //     } catch (error) {
    //         return res.status(500).json({ message: error.message });
    //     }
    // }
}