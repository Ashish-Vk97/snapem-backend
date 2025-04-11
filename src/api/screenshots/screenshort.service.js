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

      files.forEach((file) => {
        const imageLink = `${process.env.SERVER_URL}/api/screenshot/images/all/uploads/${file.filename}`;
        screenshotEntry.screenshots.push({
          imageName: file.originalname,
          imageLink: imageLink,
          mimetype: file.mimetype,
          size: file.size,
        });
      });

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
      const screenshots = await Screenshot.find({ user: userId });
      if (!screenshots) {
        return "No screenshots found for this user.";
      }
      return screenshots;
    } catch (error) {
      console.error("Error fetching screenshots:", error);
      return error.message;
    }
  }
};
