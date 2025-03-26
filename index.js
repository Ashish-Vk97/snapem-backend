require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path'); 
const mongoose = require('mongoose');
const User = require('./src/api/users/schemas/user.schema');
const apiRouter = require('./src/api/api.router');
const { role } = require('./src/helpers/global/validation.constants');
const { hashPassword } = require('./src/helpers/utils/auth.utils');
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

app.use('/api/screenshot/images/all/', express.static(path.join(__dirname, "src")));

app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(cors()); 

 
app.use('/api', apiRouter);

app.get('/', (req, res) => {
    res.send('Hello Snapem server running!');
});

const environment = process.env.NODE_ENV || 'development';

app.listen(port, () => {
    console.log(`Server is running in ${environment} mode on http://localhost:${port}`);
});   