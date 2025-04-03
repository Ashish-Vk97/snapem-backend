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
// const ngrok = require('ngrok');
// const main = require('./src/utils/mail.utils');
const app = express();
const port = process.env.PORT || 3000;


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
                role:"ADMIN" 
            }
        );
    }
 
})
.catch(err => console.log(err));

// console.log(path.join(__dirname,"src", 'uploads'), '=index====dirname');

const staticFilePath = process.env.NODE_ENV === 'production' ? path.join(__dirname, "tmp") : path.join(__dirname, "src");
app.use('/api/screenshot/images/all/', express.static(staticFilePath));

app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(cors()); 

 
app.use('/api', apiRouter);

app.get('/', (req, res) => {
    res.send('Hello Snapem server running!');
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