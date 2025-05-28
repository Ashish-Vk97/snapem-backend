const s3 = require("../../helpers/utils/s3.utils");
const { PutObjectCommand } = require("@aws-sdk/client-s3");
const User = require("../users/schemas/user.schema");
const Screenshot = require("./schemas/screenshot.schema");


module.exports = {
  saveScreenshot: async (req) => {
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
      let screenshotEntry = await Screenshot.findOne({
        user: userId,
        date: dateOnly,
      });

      if (!screenshotEntry) {
        screenshotEntry = new Screenshot({
          user: userId,
          date: dateOnly,
          screenshots: [],
        });
      }
      

      // files.forEach((file) => {
      //   const imageLink = process.env.NODE_ENV === 'production' 
      //     ? `${process.env.SERVER_URL}/api/screenshot/images/all/var/task/tmp/${file.filename}` 
      //     : `${process.env.SERVER_URL}/api/screenshot/images/all/uploads/${file.filename}`;
      //   screenshotEntry.screenshots.push({
      //     imageName: file.originalname,
      //     imageLink: imageLink,
      //     mimetype: file.mimetype,
      //     size: file.size,
      //   });
      // });

      
//  const url = "https://snapem.s3.us-east-1.amazonaws.com/screenshots/1747996559171_node+issue+screenshot.png"
    for (const file of files) {
      const ext = file.originalname.substring(file.originalname.lastIndexOf('.'));
      const key = `screenshots/${Date.now()}_screenshot_snapem${ext}`;
      const updatedFilename = key.replace(/ /g, '+');
      console.log(updatedFilename, "updatedFilename=====>");

      const uploadParams = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: updatedFilename,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: "public-read"
      };

    const location =   await s3.send(new PutObjectCommand(uploadParams));

      // Push image metadata to array
      screenshotEntry.screenshots.push({
          imageName: file.originalname,
          imageLink: `${process.env.S3_BASE_URL}/${updatedFilename}`,
           mimetype: file.mimetype,
          size: file.size,
          Etag: location.ETag
        });
    }
    

      await screenshotEntry.save();

      const user = await User.findById(userId);
      if (!user.screenshots) user.screenshots = [];

      if (!user.screenshotsList.includes(screenshotEntry._id)) {
        user.screenshotsList.push(screenshotEntry._id);
        await user.save();
      }
      console.log(screenshotEntry, "screenshotEntry service=====>");
      return screenshotEntry;
    } catch (error) {
      console.error("Error saving screenshot:", error);
      return error.message;
    }
  },
  getAllScreenshots: async (req) => {
    try {
      const userId = req.user.id;
      const { startDate, endDate } = req.query;

      const query = { user: userId };
      if (startDate || endDate) {
        query.date = {};      
        if (startDate) query.date.$gte = new Date(startDate);
        if (endDate) query.date.$lte = new Date(endDate);
      }

      console.log(query, "query=====>");

      // const screenshots = await Screenshot.find(query);
      const screenshots = await Screenshot.find(query).select('-screenshots');
      if (!screenshots || screenshots.length === 0) {
        return "No screenshots found for this user.";
      }
      return screenshots;
    } catch (error) {
      console.error("Error fetching screenshots:", error);
      return error.message;
    }
  },
  getAllScreenshotsById: async (req) => {
    const { id } = req.params;
    try {
      const screenshot = await Screenshot.findById(id).select("-__v -user");
      if (!screenshot) {
        return "Screenshots not found";
      }
      return screenshot;
    } catch (error) {
      console.error("Error fetching screenshot by ID:", error);
      return error.message;
    }
  }
};
