const mongoose = require('mongoose');
const { Schema } = mongoose;

const videoSosSchema = new Schema({
    videoName: { type: String, required: true },
    videoLink: { type: String, required: true },
    mimetype: { type: String, required: true },
    size: { type: Number, required: true },
    Etag:{ type:String, required:true} // in bytes
}, { _id: false });

const videoSchema = new Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, required: true }, // should only include the date part
    videos: [videoSosSchema],
}, { timestamps: true });

const Video =  mongoose.models.Video || mongoose.model('Video', videoSchema);
module.exports.videoSchema = videoSchema; 
module.exports = Video;
