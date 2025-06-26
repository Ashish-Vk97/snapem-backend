const { PutObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const s3 = require("../../helpers/utils/s3.utils");
const User = require("../users/schemas/user.schema");
const Video = require("./schemas/video.schema");
const moment = require("moment");
const { default: mongoose } = require("mongoose");

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
        const videoId = new mongoose.Types.ObjectId();
        const updatedFilename = key.replace(/ /g, "+");

        // Push image metadata to array
        videoEntry.videos.push({
          _id: videoId,
          s3Key: updatedFilename,
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
      const { id } = req.query;
      const userId = req.user.id;
      const query = { user: id ? id : userId };

      const videos = await Video.find(query)
        .select("-videos")
        .sort({ createdAt: -1 });
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
    const { page = 1, limit = 10 } = req.query;
    try {
      const pageNumber = parseInt(page, 10);
      const limitNumber = parseInt(limit, 10);
      const skip = (pageNumber - 1) * limitNumber;

      const video = await Video.findById(id).select("-__v");
      if (!video) {
        return "Video not found";
      }
      const totalCount = video.videos.length;

      const paginatedVideos = video.videos.reverse().slice(skip, skip + limitNumber);

      const formattedVideo = {
        ...video.toObject(),
        videos: paginatedVideos,
        date: moment(video.createdAt).format("YYYY-MM-DD HH:mm:ss"),
        createdAt: moment(video.createdAt).format("YYYY-MM-DD HH:mm:ss"),
        updatedAt: moment(video.updatedAt).format("YYYY-MM-DD HH:mm:ss"),
        totalCount,
        currentPage: pageNumber,
        totalPages: Math.ceil(totalCount / limitNumber),
      };
      return formattedVideo;
    } catch (error) {
      return error?.message;
    }
  },
  deleteSosVideos: async (req) => {
    const { id } = req.query;
    try {
      const { videoEntryId, videoIds = [], deleteAll = false } = req.body;
      const userId = id ? id : req.user.id;

      const videoEntry = await Video.findOne({
        _id: videoEntryId,
        user: userId,
      });

      if (!videoEntry) return "Video not found";
      const videosToDelete = deleteAll
        ? videoEntry.videos
        : videoEntry.videos.filter((v) => videoIds.includes(v._id.toString()));

      for (const video of videosToDelete) {
        if (video.s3Key) {
          const deleteParams = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: video.s3Key,
          };
          await s3.send(new DeleteObjectCommand(deleteParams));
        }
      }

      // Filter out deleted videos
      videoEntry.videos = videoEntry.videos.filter(
        (v) =>
          !videosToDelete.some((d) => d._id.toString() === v._id.toString())
      );
      await videoEntry.save();
      return { videos: videoEntry.videos };
    } catch (error) {
      console.error("Error deleting videos:", error);
      return error.message;
    }
  },
};
