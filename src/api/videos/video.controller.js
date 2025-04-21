const response = require('../../helpers/utils/api-response/response.function');
const Emergencycontact = require('../emergency/schemas/emergency_contact.schema');
const { saveSosVideos, getAllSosVideos } = require('./video.service');
const mailer = require("../../helpers/utils/mail.utils");

module.exports ={
    saveSosVideos: async (req, res) => {
        try {
       
            // const userId = req.user.id;
            const files = req.files;
            console.log(files,"file====>")
            if (!files.length > 0) {
                return response.servicefailureResponse(res, "No files uploaded");
            }

          
         const result = await saveSosVideos(req); 


         console.log(result,"result====>")
        //  mailer.sendMail({
        //     to: email,
        //     subject: "Password Reset Link",
        //     html: `<p>Hello ${
        //       users[0].name
        //     }, Please click the below link to reset your password. </br> </br>
        //   <p> <a href="${
        //     process.env.WEB_URL
        //   }/changePassword/${await generateToken({
        //       id: users[0]._id.toString(),
        //       email: users[0].email,
        //       role: users[0].role,
        //     })}" style="background: #212B36; text-decoration: none; color: white; padding: 10px 20px; margin: 10px 0; display: inline-block;"> 
        //       RESET
        //     </a></p>
        //    </br> </br> </p>`,
        //   });
         console.log(result, 'result');
          
      if  ( result && typeof result !== 'string'){

        const userId = result.user;

        const users = await Emergencycontact.find({userId});
        if (!users) {
            return response.servicefailureResponse(res, "User not found");
        }

        const contacts = users || [];
        if (!contacts.length) {
            console.log("No emergency contacts found for user");
        }

        const videoLink = result.videos[0]?.videoLink;

        // ✅ 4. Send email to each contact
        for (const To of contacts) {
            await mailer.sendMail({
                to: To?.email,
                subject: "Emergency SOS Video Received",
                html: `
                    <p>Hello,</p>
                    <p>An SOS video has been uploaded by your contact. You can view it using the link below:</p>
                    <p><a href="${videoLink}">${videoLink}</a></p>
                    <p>Stay safe.</p>
                `
            });
        }

          return response.successResponse(res, result, 'video files uploaded successfully');   
      }
       return response.servicefailureResponse(res, result);
        } catch (error) {
            console.log(error)
            return response.internalFailureResponse(res, error.message);
            
        }
    },
     getAllSosVideos: async (req, res) => {
            try {
          
              const result = await getAllSosVideos(req);
              
              if( result && typeof result !== 'string'){
        
                  return response.successResponse(res, result, 'All video files fetched successfully');   
              }
               return response.servicefailureResponse(res, result);
                  
             
              
            
            } catch (error) {
              // Handle errors
              return response.internalFailureResponse(res, error.message);
            }
          },
}