const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EmergencycontactSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    name: {type:String, required: true},
    email: {type:String, required: true},
    phone: {type:String, required: true},
    status: {   type: String, enum: ['active', 'inactive'],   default: 'active' },
    isActive: {type: Boolean, default: true},
    isDelete: {type: Boolean, default: false},
    
}, {timestamps: true});

const Emergencycontact =  mongoose.models.Emergencycontact || mongoose.model('Emergencycontact', EmergencycontactSchema);
module.exports.EmergencycontactSchema = EmergencycontactSchema; 
module.exports = Emergencycontact;