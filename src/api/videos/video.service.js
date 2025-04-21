const User = require("../users/schemas/user.schema");
const Video = require("./schemas/video.schema");

module.exports = {
    saveSosVideos: async (req) => {
        try {
          const userId = req.user.id;
          const files = req.files;
    
          const today = new Date();
          const dateOnly = new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate()
          );
        //   console.log(dateOnly, "dateOnly=====>");
    
        
    
          console.log(userId, req.user, "userId=====>");
          let videoEntry = await Video.findOne({
            user: userId,
            date: dateOnly,
          });
    
          if (!videoEntry) {
            videoEntry = new Video({
              user: userId,
              date: dateOnly,
             videos: [],
            });
          }
    
          files.forEach((file) => {
            const imageLink = `${process.env.SERVER_URL}/api/video/sos/all/videoupload/${file.filename}`;
            videoEntry.videos.push({
              videoName: file.originalname,
              videoLink: imageLink,
              mimetype: file.mimetype,
              size: file.size,
            });
          });
    
          await videoEntry.save();
    
    
          const user = await User.findById(userId);
          if (!user.videosList) user.videosList = [];
    
          if (!user.videosList.includes(videoEntry._id)) {
            user.videosList.push(videoEntry._id);
            await user.save();
    
           
          }
          console.log(videoEntry, "screenshotEntry service=====>");
          return videoEntry;
        } catch (error) {
            console.error("Error saving screenshot:", error);
            return error.message;
        }
      },
      getAllSosVideos: async (req) => {
          try {
            const userId = req.user.id;
            const videos = await Video.find({ user: userId });
            if (!videos) {
              return "No screenshots found for this user.";
            }
            return videos;
          } catch (error) {
            console.error("Error fetching screenshots:", error);
            return error.message;
          }
        }
}