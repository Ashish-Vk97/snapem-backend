const mongoose = require('mongoose');
const { Schema } = mongoose;

const videoSosSchema = new Schema({
    _id:{ type: String, default: () => new mongoose.Types.ObjectId().toString() },
    videoName: { type: String, required: true },
    videoLink: { type: String, required: true },
    mimetype: { type: String, required: true },
    size: { type: Number, required: true },
    Etag:{ type:String, required:true}, // in bytes
     s3Key:{type: String, required:true} 
}, { _id: false });

const videoSchema = new Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, required: true }, // should only include the date part
    videos: [videoSosSchema],
}, { timestamps: true });

const Video =  mongoose.models.Video || mongoose.model('Video', videoSchema);
module.exports.videoSchema = videoSchema; 
module.exports = Video;
