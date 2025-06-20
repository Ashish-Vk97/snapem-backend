const s3 = require("../../helpers/utils/s3.utils");
const { PutObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const User = require("../users/schemas/user.schema");
const Screenshot = require("./schemas/screenshot.schema");
const moment = require("moment");
const { default: mongoose } = require("mongoose");

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
        const ext = file.originalname.substring(
          file.originalname.lastIndexOf(".")
        );
        const key = `screenshots/${Date.now()}_screenshot_snapem${ext}`;
        const updatedFilename = key.replace(/ /g, "+");
        console.log(updatedFilename, "updatedFilename=====>");

        const uploadParams = {
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: updatedFilename,
          Body: file.buffer,
          ContentType: file.mimetype,
          // ACL: "public-read",
        };

        const location = await s3.send(new PutObjectCommand(uploadParams));
        const screenshotId = new mongoose.Types.ObjectId();

        // Push image metadata to array
        screenshotEntry.screenshots.push({
          _id: screenshotId,
          s3Key: updatedFilename,
          imageName: file.originalname,
          imageLink: `${process.env.S3_BASE_URL}/${updatedFilename}`,
          mimetype: file.mimetype,
          size: file.size,
          Etag: location.ETag,
        });
      }

      await screenshotEntry.save();

      const user = await User.findById(userId);
      console.log(user, "user=====>");
      if (!user) {
        throw new Error("User not found");
      }
      if (!user?.screenshotsList) user.screenshotsList = [];

      if (!user.screenshotsList.includes(screenshotEntry._id)) {
        user?.screenshotsList.push(screenshotEntry._id);
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
      const { startDate, endDate, id } = req.query;

      const query = { user: id ? id : userId };
      if (startDate || endDate) {
        query.date = {};
        if (startDate) query.date.$gte = new Date(startDate);
        if (endDate) query.date.$lte = new Date(endDate);
      }

      // const pageNumber = parseInt(page, 10);
      // const limitNumber = parseInt(limit, 10);
      // const skip = (pageNumber - 1) * limitNumber;

      console.log(query, "query=====>");
      // const totalCount = await Screenshot.countDocuments(query);

      // const screenshots = await Screenshot.find(query);
      const screenshots = await Screenshot.find(query).select("-screenshots");
      if (!screenshots || screenshots.length === 0) {
        return "No screenshots found for this user.";
      }

      const formattedScreenshots = screenshots.map((item) => ({
        ...item.toObject(),
        date: moment(item.createdAt).format("YYYY-MM-DD HH:mm:ss"),
        createdAt: moment(item.createdAt).format("YYYY-MM-DD HH:mm:ss"),
        updatedAt: moment(item.updatedAt).format("YYYY-MM-DD HH:mm:ss"),
      }));

      console.log(formattedScreenshots, "formattedScreenshots=====>");
      return formattedScreenshots;
    } catch (error) {
      console.error("Error fetching screenshots:", error);
      return error.message;
    }
  },
  getAllScreenshotsById: async (req) => {
    const { id } = req.params;
    const { page = 1, limit = 10 } = req.query;
    try {
      const pageNumber = parseInt(page, 10);
      const limitNumber = parseInt(limit, 10);
      const skip = (pageNumber - 1) * limitNumber;

      const screenshot = await Screenshot.findById(id).select("-__v -user");
      if (!screenshot) {
        return "Screenshots not found";
      }
      console.log(screenshot, "screenshot=====>");

       const totalCount = screenshot.screenshots.length;

       const paginatedScreenshots = screenshot.screenshots
      .slice(skip, skip + limitNumber)
    

        const formattedScreenshot = {
      ...screenshot.toObject(),
      screenshots: paginatedScreenshots, // replace full list with paginated list
      date: moment(screenshot.createdAt).format("YYYY-MM-DD HH:mm:ss"),
      createdAt: moment(screenshot.createdAt).format("YYYY-MM-DD HH:mm:ss"),
      updatedAt: moment(screenshot.updatedAt).format("YYYY-MM-DD HH:mm:ss"),
      totalCount,
      currentPage: pageNumber,
      totalPages: Math.ceil(totalCount / limitNumber),
    };
      
      // const formattedScreenshot = {
      //   ...screenshot.toObject(),
      //   date: moment(screenshot.createdAt).format("YYYY-MM-DD HH:mm:ss"),
      //   createdAt: moment(screenshot.createdAt).format("YYYY-MM-DD HH:mm:ss"),
      //   updatedAt: moment(screenshot.updatedAt).format("YYYY-MM-DD HH:mm:ss"),
      // };
 
      console.log(formattedScreenshot, "formattedScreenshot=====>");
      return formattedScreenshot;
    } catch (error) {
      console.error("Error fetching screenshot by ID:", error);
      return error.message;
    }
  },
  deleteScreenshots: async (req) => {
    const { id } = req.query;
    try {
      // const screenshot = await Screenshot.findByIdAndDelete(id);
      // if (!screenshot) {
      //   return "Screenshot not found";
      // }
      const {
        screenshotEntryId,
        screenshotIds = [],
        deleteAll = false,
      } = req.body;
      const userId = id ? id : req.user.id;

      const screenshotEntry = await Screenshot.findOne({
        _id: screenshotEntryId,
        user: userId,
      });

      if (!screenshotEntry) return "Screenshot not found";
      const screenshotsToDelete = deleteAll
        ? screenshotEntry.screenshots
        : screenshotEntry.screenshots.filter((s) =>
            screenshotIds.includes(s._id.toString())
          );

      //  const remainingScreenshots = [];
      for (const screenshot of screenshotsToDelete) {
        if (screenshot.s3Key) {
          const deleteParams = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: screenshot.s3Key,
          };
          await s3.send(new DeleteObjectCommand(deleteParams));
        }
      }

      // Filter out deleted screenshots
      screenshotEntry.screenshots = screenshotEntry.screenshots.filter(
        (s) =>
          !screenshotsToDelete.some(
            (d) => d._id.toString() === s._id.toString()
          )
      );
      await screenshotEntry.save();

      // console.log(screenshot, "screenshot=====>");
      return { screenshots: screenshotEntry.screenshots };
    } catch (error) {
      console.error("Error deleting screenshot:", error);
      return error.message;
    }
  },
};
