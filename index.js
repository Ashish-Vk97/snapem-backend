require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path'); 
const mongoose = require('mongoose');
const User = require('./src/api/users/schemas/user.schema');
const apiRouter = require('./src/api/api.router');
const ngrok = require("@ngrok/ngrok");
const { role } = require('./src/helpers/global/validation.constants');
const { hashPassword } = require('./src/helpers/utils/auth.utils');
const helmet = require('helmet');
const { subscriptionManagerWebhook } = require('./src/api/payment/payment.controller');
const { runCleanupJob } = require('./src/helpers/utils/cleanupScreenshot.utils');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const cron = require("node-cron");
// const ngrok = require('ngrok');
// const main = require('./src/utils/mail.utils');

const app = express();
const port = process.env.PORT || 3000;


  
const allowedOrigins = [process.env.WEB_URL || "https://snapem.org"];
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS not allowed"));
    }
  },
  credentials: true,
}));

app.options("*", cors());// enable preflight across-the-board
 cron.schedule("0 0 * * *", async () => {
    // Run the cleanup job every 10 minutes
    // cron.schedule("*/5 * * * *", async () => {
        console.log("Running backup...");
        const startTime = new Date();
        await runCleanupJob(startTime);
    });


app.use(
    helmet({
      frameguard: false, // This disables X-Frame-Options
    })
  );
  
  // OR: allow iframes from your origin
  app.use((req, res, next) => {
    res.setHeader('X-Frame-Options', 'ALLOWALL'); 
    next();
  });
 
// app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));


mongoose.connect(process.env.MONGODB_URI)
.then(async() =>{
    console.log('MongoDB connected successfully')
    const user = await User.findOne({email: 'john@email.com'});
    if(!user){
        await User.create(
            {       
                name: 'John Doe',
                email: 'john@email.com',
                password: await hashPassword('123456'),
                phone:"+1234567890",  
                role:"ADMIN" ,
                address:{
                    country: "India",
                    state: "Maharashtra",
                    pincode: "400001",
                    city: "Mumbai"
                }
            }
        );
    }
 
})
.catch(err => console.log(err));

// console.log(path.join(__dirname,"src", 'uploads'), '=index====dirname');

const staticFilePath = process.env.NODE_ENV === 'production' ? path.join(__dirname, "tmp") : path.join(__dirname, "src");
const staticVideoFilePath = process.env.NODE_ENV === 'production' ? path.join(__dirname, "tmp") : path.join(__dirname, "src");

console.log(staticFilePath, 'staticFilePath====>');
app.use('/api/screenshot/images/all/', express.static(staticFilePath));
app.use('/api/video/sos/all/', express.static(staticVideoFilePath));




 
app.use('/api',express.json(), apiRouter);
app.use("/stripe/webhook", express.raw({type: 'application/json'}), subscriptionManagerWebhook),
// app.get("/success", async(req, res) => {
//     console.log(req.query.session_id, "session_id");
//     const session = await stripe.checkout.sessions.retrieve(req.query.session_id,{expand:['subscription', 'subscription.plan.product',"customer"]});
//     console.log(session, "session");
//     const customerDetails = session.customer_details;
// const billingAddress = customerDetails.address; // Includes: city, state, postal_code, country
// const email = customerDetails.email;

// const user = await User.findOne({ email }); // or use your session/auth system

// if (user) {
//   user.stripeCustomerId = session?.customer?.id;
//   user.address = {
//     country: billingAddress.country || '',
//     state: billingAddress.state || '',
//     city: billingAddress.city || '',
//     pincode: billingAddress.postal_code || '',
//   };
//   await user.save();
// }

//     res.send("Payment successfull");
// })
app.get("/cancel", (req, res) => {
    res.send("Payment cancelled");
})

app.get('/', (req, res) => {
    res.send('Hello Snapem server running!' + staticFilePath);
});

const environment = process.env.NODE_ENV || 'development';

// (async function () {

//  try {
//      const listener = await ngrok.forward({
//        addr: 3000,
//        authtoken_from_env: true,
//        domain: "1c25-2405-201-a00a-ab44-31f1-11b5-5edd-fd.ngrok-free.app",
//      });
   
//      console.log(`Ingress established at: ${listener.url()}`);
//  } catch (error) {
//      console.error("Error establishing ingress:", error);
    
//  }
// })();

// ngrok.connect({ addr: 3000, authtoken_from_env: true }) 
// 	.then(listener => console.log(`Ingress established at: ${listener}`))
//     .catch(err => {
//         console.error('Error connecting to Ngrok:', err);
//     });

app.listen(port, () => {  
    console.log(`Server is running in ${environment} mode on http://localhost:${port}`);
});   