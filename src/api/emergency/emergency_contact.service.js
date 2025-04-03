const User = require("../users/schemas/user.schema");
const Emergencycontact = require("./schemas/emergency_contact.schema");

module.exports = {
  createEmergencyContact: async (req, res) => {
    try {
      const data = req.body;
      const contactData ={
        userId:req.user.id,
        ...data
      }
      console.log(req.user.id, contactData,"userId==================>");
      const contact = new Emergencycontact(contactData);
      const savedEmergencyContact = await contact.save();

      if (savedEmergencyContact) {
       
        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            {
              $push: { emergencyContacts: savedEmergencyContact._id },
            },
            { new: true } 
          );

        //   console.log(updatedUser, "updatedUser==================>");
           return savedEmergencyContact;
      }
      return "Emergency contact not created something went wrong";
    } catch (error) {
      return error.message;
    }
  },
  getAllEmergencyContacts: async (req) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    try {
      const startIndex = (page - 1) * limit;
      const emergencyContacts = await Emergencycontact
        .find({ userId: req.user.id })
        // .populate("userId", "-password -__v")
        .limit(limit)
        .skip(startIndex)
        .sort({ createdAt: -1 });

      if (emergencyContacts.length > 0) {
        return emergencyContacts;
      }
      return "Emergency contacts not found";
    } catch (error) {
      return error.message;
    }
  },
  getEmergencyById: async (req) => {
    const { id } = req.params;
    try {
      const emergencyContact = await Emergencycontact.findById(id).select("-__v -password ");
      if (!emergencyContact) {
        return "Emergency contact not found";
      }
      return emergencyContact;
    } catch (error) {
      return error?.message;
    }
  },
  updateEmergencyById: async (req) => {
    const { id } = req.params;
    const data = req.body;
    try {
      const updatedEmergencyContact = await Emergencycontact.findByIdAndUpdate(
        id,
        { $set: { ...data } },
        { new: true }
      );
      if (!updatedEmergencyContact) {
        return "Emergency contact not found";
      }
      return updatedEmergencyContact;
    } catch (error) {
      return error?.message;
    }
  },
  deleteEmergencyContact: async (req) => {
    const { id } = req.params;
    
    try {

      const deletedEmergencyContact = await Emergencycontact.findByIdAndDelete(id);
      if (!deletedEmergencyContact) {
        return "Emergency contact not found";
      }
  
      
      const userId = deletedEmergencyContact.userId; 
  
      
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        {
          $pull: { emergencyContacts: id }, 
        },
        { new: true } 
      );
  
      if (!updatedUser) {
        return "User not found";
      }
  
      // Return the updated user document or a success message
      return  deletedEmergencyContact;
    } catch (error) {
      return error?.message;
    }
  },
  
};
