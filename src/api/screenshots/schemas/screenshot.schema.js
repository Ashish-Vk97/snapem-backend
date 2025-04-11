const mongoose = require('mongoose');
const { Schema } = mongoose;

const screenshotImageSchema = new Schema({
    imageName: { type: String, required: true },
    imageLink: { type: String, required: true },
    mimetype: { type: String, required: true },
    size: { type: Number, required: true }, // in bytes
}, { _id: false });

const screenshotSchema = new Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, required: true }, // should only include the date part
    screenshots: [screenshotImageSchema],
}, { timestamps: true });

const Screenshot =  mongoose.models.Screenshot || mongoose.model('Screenshot', screenshotSchema);
module.exports.screenshotSchema = screenshotSchema; 
module.exports = Screenshot;
