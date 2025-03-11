const jwt = require('jsonwebtoken');
const { authFailureResponse } = require('../utils/api-response/response.function');

function authenticateToken(req, res, next) {
    const JWT_SECRET = process.env.JWT_SECRET || "12GDHDHDYET34BBCHCHGSJSNSBHDTCYR";
    const authHeader = req.headers['authorization'] || req.headers['Authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    console.log(token,authHeader, 'token===>');

    if (!token) return authFailureResponse(res, 'Token not found');
  
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return authFailureResponse(res, 'Invalid token or token expired');
        req.user = user;  
        next();
    });
}

module.exports = authenticateToken;