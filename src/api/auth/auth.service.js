const { signIn, forgotPassword } = require("./auth.validation");
const User = require("../users/schemas/user.schema");
const MobileDetect = require("mobile-detect");
const {
  comparePassword,
  generateToken,
  hashPassword,
} = require("../../helpers/utils/auth.utils");
const { role } = require("../../helpers/global/validation.constants");
const mailer = require("../../helpers/utils/mail.utils");
module.exports = {
  // signIn: async (data, req) => {
  //   const { email, password } = data;
  //   try {
  //     const user = await User.findOne({ email });

  //     if (!user) {
  //       return "Email or password is incorrect. Please try again.";
  //     }
  //     if (!user.isActive) {
  //       return "You are currently inactive. Please contact your Admin.";
  //     }
  //     // Check if request is from a mobile device
  //     // Assume 'data.req' contains the Express request object
  //     let isMobile = false;

  //     // if (req && req.headers && req.headers["user-agent"]) {
  //     //   const md = new MobileDetect(req.headers["user-agent"]);
  //     //   isMobile = !!md.phone(); // true only for real phones, not tablets or desktops
  //     // }
  //         if (req && req.headers && req.headers['user-agent']) {
  //           const userAgent = req.headers['user-agent'];
  //           console.log(userAgent, "userAgent in auth service");
            
  //          isMobile = /android/i.test(userAgent) && /mobile/i.test(userAgent);

  //         }
  //     console.log(isMobile, "mob=======>");
  //     // if (user.role === "USER" && !user.isSubscribed && isMobile) {
  //     //   return "You have no subscription. Please purchase your plan.";
  //     // }

  //     // if(user.isDelete) {
  //     //     return  'User is deleted';
  //     // }

  //     const verified = await comparePassword(password, user.password);

  //     if (!verified) {
  //       return "Email or password is incorrect! Please try again";
  //     }
  //     return {
  //       token: await generateToken({
  //         id: user._id,
  //         email: user.email,
  //         role: user.role,
  //       }),
  //       _id: user._id,
  //       name: user.name,
  //       role: user.role,
  //       email: user.email,
  //     };
  //   } catch (error) {
  //     return `internal server error===>${error.message}`;
  //   }
  // },
  // signUp: async (data) => {
  //   try {
  //     const { name, email } = data;

  //     const user = await User.findOne({ email });

  //     if (user) {
  //       return `User already exists`;
  //     }

  //     data.password = await hashPassword(data.password);

  //     const newUser = new User(data);
  //     const userDetails = await newUser.save();

  //     const userDetailsObj = userDetails.toObject();

  //     return {
  //       name: userDetailsObj.name,
  //       role: userDetailsObj.role,
  //       email: userDetailsObj.email,
  //     };
  //   } catch (error) {
  //     console.log(error);
  //     return "internal server error ===> " + error.message;
  //   }
  // },

  // forgotPassword: async (data) => {
  //   const { email,password } = data;

  //   try {
  //     const user = await User.findOne({ email });
  //     if (!user) {
  //       return "User not found";
  //     }

  //     // Generate a temporary password or token
  //     const tempPassword = Math.random().toString(36).slice(-8);
  //     // console.log('tempPassword', tempPassword);
  //     user.password = await hashPassword(password);
  //     await user.save();

  //     return {
  //       message: "Temporary password has been generated",
  //       tempPassword: password
  //     };

  //   } catch (error) {
  //     return `internal server error ===> ${error.message}`;
  //   }
  // },


  signIn: async (data, req) => {
  const email = data.email.toLowerCase(); // Convert to lowercase
  const { password } = data;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return "Email or password is incorrect. Please try again.";
    }

    if (!user.isActive) {
      return "You are currently inactive. Please contact your Admin.";
    }

    let isMobile = false;
    if (req && req.headers && req.headers["user-agent"]) {
      const userAgent = req.headers["user-agent"];
      console.log(userAgent, "userAgent in auth service");
      isMobile = /android/i.test(userAgent) && /mobile/i.test(userAgent);
    }

    console.log(isMobile, "mob=======>");

    const verified = await comparePassword(password, user.password);

    if (!verified) {
      return "Email or password is incorrect! Please try again";
    }

    return {
      token: await generateToken({
        id: user._id,
        email: user.email,
        role: user.role,
      }),
      _id: user._id,
      name: user.name,
      role: user.role,
      email: user.email,
    };
  } catch (error) {
    return `internal server error===>${error.message}`;
  }
},

  signUp: async (data) => {
  try {
    // Ensure email is lowercase before checking and saving
    const email = data.email.toLowerCase();
    const { name } = data;

    // Check if user already exists
    const user = await User.findOne({ email });
    if (user) {
      return `User already exists`;
    }

    // Hash the password
    data.password = await hashPassword(data.password);

    // Set email in lowercase
    const newUser = new User({ ...data, email });
    const userDetails = await newUser.save();

    const userDetailsObj = userDetails.toObject();

    return {
      name: userDetailsObj.name,
      role: userDetailsObj.role,
      email: userDetailsObj.email,
    };
  } catch (error) {
    console.log(error);
    return "internal server error ===> " + error.message;
  }
},

  forgotPassword: async (email) => {
    try {
      console.log(email, "==========>");
      // const users = await userService.getUserByEmail(email);
      const users = await User.find({ email });
      // console.log(users, "============>forgot passwrd");
      if (users && users.length > 0) {
        mailer.sendMail({
          to: email,
          subject: "Password Reset Link",
          html: `<p>Hello ${
            users[0].name
          }, Please click the below link to reset your password. </br> </br>
        <p> <a href="${
          process.env.WEB_URL
        }/changePassword/${await generateToken({
            id: users[0]._id.toString(),
            email: users[0].email,
            role: users[0].role,
          })}" style="background: #212B36; text-decoration: none; color: white; padding: 10px 20px; margin: 10px 0; display: inline-block;"> 
            RESET
          </a></p>
         </br> </br> </p>`,
        });

        return {
          message: `Password reset link has been sent to your mail!`,
          link: `${process.env.WEB_URL}/changePassword/${await generateToken({
            id: users[0]._id.toString(),
            email: users[0].email,
            role: users[0].role,
          })}`,
        };
        // } `Password reset link has been sent to your mail!\n${
        //   process.env.WEB_URL
        // }/changePassword?token=${getAccessToken(
        //   users[0]._id.toString(),
        //   users[0].role,
        //   users[0].email,

        // )}`;
      } else return "User has not been registered with us!";
    } catch (error) {
      console.log(error);
      // logger.error(`Forgot password failed error log file: ${error.message}`);
    }
  },
};
