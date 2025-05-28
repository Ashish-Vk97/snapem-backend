const response = require("../../helpers/utils/api-response/response.function");
const Emergencycontact = require("../emergency/schemas/emergency_contact.schema");
const { saveSosVideos, getAllSosVideos } = require("./video.service");
const mailer = require("../../helpers/utils/mail.utils");
const User = require("../users/schemas/user.schema");

function parseLocationString(str) {
  const latMatch = str.match(/Lat:\s*(-?\d+(\.\d+)?)/);
  const lngMatch = str.match(/Lng:\s*(-?\d+(\.\d+)?)/);

  if (!latMatch || !lngMatch) {
    throw new Error("Invalid location string format");
  }

  const lat = parseFloat(latMatch[1]);
  const lng = parseFloat(lngMatch[1]);

  return {
    type: "Point",
    coordinates: [lng, lat], // Note: [longitude, latitude]
  };
}

// Example usage:
// const geoLocation = parseLocationString("Lat: 28.6105872, Lng: 77.4593648");

// Now you can save `geoLocation` to MongoDB via Mongoose

module.exports = {
  saveSosVideos: async (req, res) => {
    try {
      

      // const userId = req.user.id;
      const files = req.files;
      console.log(files, req.body, "file====>");
      if (!files.length > 0) {
        return response.servicefailureResponse(res, "No files uploaded");
      }
      // if (!req.body.location) {
      //   return response.servicefailureResponse(res, "Location is required");
      // }
     

      const result = await saveSosVideos(req);

      console.log(result, "result====>");

      if (result && typeof result !== "string") {
        const userId = result.user;
        if (req.body.location) {
          const geoLocation = parseLocationString(req.body.location);
          console.log(geoLocation, "geoLocation====>");
          await User.findByIdAndUpdate(userId, { location: geoLocation });
        }

        const users = await Emergencycontact.find({ userId });
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
                    <p><a href="${videoLink}">CLICK </a></p>
                    <p>Stay safe.</p>
                `,
          });
        }

        return response.successResponse(
          res,
          result,
          "video files uploaded successfully"
        );
      }
      return response.servicefailureResponse(res, result);
    } catch (error) {
      console.log(error);
      return response.internalFailureResponse(res, error.message);
    }
  },
  getAllSosVideos: async (req, res) => {
    try {
      const result = await getAllSosVideos(req);

      if (result && typeof result !== "string") {
        return response.successResponse(
          res,
          result,
          "All video files fetched successfully"
        );
      }
      return response.servicefailureResponse(res, result);
    } catch (error) {
      // Handle errors
      return response.internalFailureResponse(res, error.message);
    }
  },
};
