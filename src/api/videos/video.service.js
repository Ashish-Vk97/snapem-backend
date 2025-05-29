const { PutObjectCommand } = require("@aws-sdk/client-s3");
const s3 = require("../../helpers/utils/s3.utils");
const User = require("../users/schemas/user.schema");
const Video = require("./schemas/video.schema");
const moment = require("moment");

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

      console.log(userId, req.user, files, "userId=====>");
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

      // files.forEach((file) => {
      //   const imageLink = `${process.env.SERVER_URL}/api/video/sos/all/videoupload/${file.filename}`;
      //   videoEntry.videos.push({
      //     videoName: file.originalname,
      //     videoLink: imageLink,
      //     mimetype: file.mimetype,
      //     size: file.size,
      //   });
      // });

      for (const file of files) {
        // const key = `videos/${Date.now()}_${file.originalname}`;
        const ext = file.originalname.substring(
          file.originalname.lastIndexOf(".")
        );
        const key = `videos/${Date.now()}_videos_snapem${ext}`;
        // const updatedFilename = key.replace(/ /g, '+');
        // console.log(updatedFilename, "updatedFilename=====>");

        const uploadParams = {
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: key,
          Body: file.buffer,
          ContentType: file.mimetype,
          // ACL: "public-read"
        };

        const location = await s3.send(new PutObjectCommand(uploadParams));

        // Push image metadata to array
        videoEntry.videos.push({
          videoName: file.originalname,
          videoLink: `${process.env.S3_BASE_URL}/${key}`,
          mimetype: file.mimetype,
          size: file.size,
          Etag: location.ETag,
        });
      }

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
      const videos = await Video.find({ user: userId }).select("-videos");
      if (!videos || videos.length === 0) {
        return "No videos found for this user.";
      }

      const formattedVideos = videos.map((item) => ({
        ...item.toObject(),
        date: moment(item.createdAt).format("YYYY-MM-DD HH:mm:ss"),

        createdAt: moment(item.createdAt).format("YYYY-MM-DD HH:mm:ss"),
        updatedAt: moment(item.updatedAt).format("YYYY-MM-DD HH:mm:ss"),
      }));
      return formattedVideos;
    } catch (error) {
      console.error("Error fetching videos:", error);
      return error.message;
    }
  },

  getAllSosVideosById: async (req) => {
    const { id } = req.params;
    try {
      const video = await Video.findById(id).select("-__v");
      if (!video) {
        return "Video not found";
      }

        const formattedVideo = {
              ...video.toObject(),
              date: moment(video.createdAt).format("YYYY-MM-DD HH:mm:ss"),
              createdAt: moment(video.createdAt).format("YYYY-MM-DD HH:mm:ss"),
              updatedAt: moment(video.updatedAt).format("YYYY-MM-DD HH:mm:ss"),
            };
      return formattedVideo;
    } catch (error) {
      return error?.message;
    }
  },
};
