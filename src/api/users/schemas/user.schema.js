const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {type:String, required: true},
    email: {type:String, required: true},
    password: {type:String, required: true},    
    gender:{type:String, enum: ['M', 'F', 'O'], default: 'M'},
    role: {type:String, enum: ['ADMIN', 'USER'], default: 'USER'},
    phone: {type:String, required: true},
    status: {   type: String,   enum: ['active', 'inactive'],   default: 'active' },
    profileImage: {type:String, default: null},
    address: {
        country: {type: String, required: true},
       state: {type: String, required: true},
        pincode: {type: String, required: true},
        city: {type: String, required: true}
    },
    screenshotsList: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Screenshot' }],
  
    emergencyContacts: [{type: mongoose.Schema.Types.ObjectId, ref: "Emergencycontact"}],
    emergencyContactId: {type: mongoose.Schema.Types.ObjectId, ref: "Emergencycontact"},
    isActive: {type: Boolean, default: true},
    isDelete: {type: Boolean, default: false},
    
    created_at: Date,
    updated_at: Date 
}, {timestamps: true});

const User =  mongoose.models.User || mongoose.model('User', userSchema);
module.exports.UserSchema = userSchema; 
module.exports = User;