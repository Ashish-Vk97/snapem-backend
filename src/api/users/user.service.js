const { comparePassword, hashPassword } = require("../../helpers/utils/auth.utils");
const User = require("./schemas/user.schema");
const mongoose = require("mongoose");
module.exports = {
  createUser: async (req, res) => {
    try {
      const user = new User(req.body);
      const newUser = await user.save();
      res.status(201).json(newUser);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
  getAllUsers: async (req) => {
    const page = parseInt(req.query.page) || 1;

    const limit = parseInt(req.query.limit) || 10;
    try {
      const startIndex = (page - 1) * limit;
    //   const endIndex = page * limit;

      const users = await User.find()
        .limit(limit)
        .skip(startIndex)
        .sort({ createdAt: -1 });

      if (users.length > 0) {
        return users;
      }
      return "users not found";
    } catch (error) {
      return error.message;
    }
  },
  getUserById: async (req) => {         
    const {id} = req.params;
        
    try {
      const user = await User.findById(id).select("-password -__v ");
      if (!user) {
        return "user not found";     
      }
      return user;    
    
    } catch (error) { 
        return error?.message;
    }
  },
  updateUser: async (req) => {

    const {id} = req.params;
    const data = req.body;
    try {
      const updatedUser = await User.findByIdAndUpdate(
        id,
        { $set: {...data} },
        { new: true }
      );
      if (!updatedUser) {
        return  "User not found";
      }
      updatedUser.password = undefined;
      return updatedUser;
    } catch (error) { 
      return error.message;
    }
  },
  deleteUser: async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (user == null) {
        return res.status(404).json({ message: "User not found" });    
      }
      await user.remove();
      res.json({ message: "User deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

   changePassword : async(userId, password) => {
    try {
      if (!mongoose.isValidObjectId(userId)) return "Invalid user id!";
  
      const users = await User.findById(userId);
      if (users) {
        
          const verified = await comparePassword(password, users.password);
          if (verified) return password;
        
        return await User.findByIdAndUpdate(
          {
            _id: userId,
          },
          {
            password: await hashPassword(password),
          },
          { new: true }
        );
      }
    } catch (error) {
      // logger.error(`Change password service failed: ${error.message}`);
      console.log(error.message);
    }
  },
  updateUserStatus : async (userId, status) => {
  try {
    if (!mongoose.isValidObjectId(userId)) return "Invalid user id!";
    
    let active_status;
    if (status === "inactive" || status === "false") {
      active_status = false;
    } else if (status === "active" || status === "true") {
      active_status = true;
    }
    
    return await User.findByIdAndUpdate(
      {
        _id: userId,
      },
      {
        isActive: active_status,
      },
      { new: true }
    );
    
  } catch (error) {
   
    console.log(error.message);
  }
}
};
