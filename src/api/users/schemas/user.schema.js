const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {type:String, required: true},
    email: {type:String, required: true},
    password: {type:String, required: true},    
    gender:{type:String, enum: ['M', 'F', 'O'], default: 'M'},
    role: {type:String, enum: ['admin', 'user'], default: 'user'},
    phone: {type:String, required: true},
    status: {   type: String,   enum: ['active', 'inactive'],   default: 'active' },
    isActive: {type: Boolean, default: true},
    isDelete: {type: Boolean, default: false},
    
    created_at: Date,
    updated_at: Date 
}, {timestamps: true});

const User =  mongoose.models.User || mongoose.model('User', userSchema);
module.exports.UserSchema = userSchema; 
module.exports = User;