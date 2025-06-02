const response = require('../../helpers/utils/api-response/response.function');
const path = require('path');
const Screenshot = require('./schemas/screenshot.schema');
const User = require('../users/schemas/user.schema');
const { saveScreenshot, getAllScreenshots, getAllScreenshotsById } = require('./screenshort.service');
const fs = require('fs').promises;

module.exports ={
    saveScreenshot: async (req, res) => {
        try {
          // const userId = req.user.id;
            const files = req.files;
            console.log(req.files,"file====>")
            if (!files?.length > 0) {
                return response.servicefailureResponse(res, "No files uploaded");
            }
         
         const result = await saveScreenshot(req); 
         console.log(result, 'result');
          
      if( result && typeof result !== 'string'){

          return response.successResponse(res, result, 'screenshot files uploaded successfully');   
      }
       return response.servicefailureResponse(res, result);
 
        } catch (error) {
          console.log(error)
            return response.internalFailureResponse(res, error.message);
        }
    },
    getAllScreenshots: async (req, res) => {
        try {
        //     const uploadDir = process.env.NODE_ENV === 'production' 
        //         ? '/tmp/' 
        //         : path.join(__dirname, '..', '..', 'uploads');

        // //   console.log( path.join(__dirname, '..',"..", 'uploads'), '==========>');
          
   
        //   const files = await fs.readdir(uploadDir);
      
        //   // Generate full file paths
        //   const filePaths = files.map(file => `${process.env.SERVER_URL}/api/screenshot/images/all/uploads/${file}`);
        
        //   // Send the list of file paths back as a JSON response
        //   if (!filePaths.length >0) {
        //     return response.servicefailureResponse(res, "No files uploaded");
        //   }
        //   const results ={
        //         message: 'All screenshots fetched successfully',
        //         images: filePaths
        //   }
          const result = await getAllScreenshots(req);
          
          if( result && typeof result !== 'string'){
    
              return response.successResponse(res, result, 'screenshot folders fetched successfully');   
          }
           return response.servicefailureResponse(res, result);
              
         
          
        
        } catch (error) {
          // Handle errors
          return response.internalFailureResponse(res, error.message);
        }
      },
       getAllScreenshotsById: async (req, res) => {
        try {
                     
          const result = await getAllScreenshotsById(req);
          
          if( result && typeof result !== 'string'){
    
              return response.successResponse(res, result, 'screenshot files fetched successfully');   
          }
           return response.servicefailureResponse(res, result);
              
         
          
        
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