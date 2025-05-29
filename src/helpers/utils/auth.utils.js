const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const response = require('../utils/api-response/response.function');

const salt = bcrypt.genSaltSync(10)
const JWT_SECRET = process.env.JWT_SECRET || "12GDHDHDYET34BBCHCHGSJSNSBHDTCYR";
module.exports = {
    generateToken: async (data) => {
        return await jwt.sign(data, JWT_SECRET, { expiresIn: '7d' });
    },
    comparePassword: async (password, hash) => {
        return bcrypt.compare(password,hash);
    }, 
    hashPassword: async (password) => {
        return bcrypt.hash(password, salt);
    },
    verifyToken: async (token) => { 
        return jwt.verify(token, JWT_SECRET);
    }
}

