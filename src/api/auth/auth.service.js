
const { signIn, forgotPassword } = require('./auth.validation');
const User = require('../users/schemas/user.schema');
const { comparePassword, generateToken, hashPassword } = require('../../helpers/utils/auth.utils');
const { role } = require('../../helpers/global/validation.constants');

module.exports = {
  signIn: async (data) => {

    const {email, password} = data;
    try {
            
        const user = await User.findOne({email});
        if(!user) {
            return "User not found";
        }
        if(!user.isActive) {
            return  'User is not active';
        }
         
        // if(user.isDelete) {
        //     return  'User is deleted';
        // }  
  
       const verified =  await comparePassword(password, user.password)
   
        if( !verified) {
            return  "You have entered a wrong password! Please try again";
        }
       return {
        token: await generateToken({id: user._id, email: user.email, role: user.role}),
        _id: user._id,
        name: user.name,
        role:user.role,
        email: user.email,
       }   
  
    } catch (error) {
      return `internal server error===>${error.message}`;
    }
  },
   signUp: async (data) => {
    try {
      const { name, email } = data;

      const user  = await User.findOne({email});

      if(user) {     
        return `User already exists`;
      }
      
     
    data.password = await hashPassword(data.password);
     
      const newUser = new User(data);
      const userDetails = await newUser.save();
    
      const userDetailsObj = userDetails.toObject();
     

      return {
        name: userDetailsObj.name,
        role: userDetailsObj.role,
        email: userDetailsObj.email,
      };
     
    } catch (error) {
      console.log(error)
      return "internal server error ===> "+error.message;
    }
  },

  forgotPassword: async (data) => {
    const { email,password } = data;

    try {
      const user = await User.findOne({ email });
      if (!user) {
        return "User not found";
      }

      // Generate a temporary password or token
      const tempPassword = Math.random().toString(36).slice(-8);
      // console.log('tempPassword', tempPassword);
      user.password = await hashPassword(password);
      await user.save();

      
      return {
        message: "Temporary password has been generated",
        tempPassword: password
      };
    

     
    } catch (error) {
      return `internal server error ===> ${error.message}`;
    }
  },
};
