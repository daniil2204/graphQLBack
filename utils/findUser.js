const jwt = require('jsonwebtoken');
const User = require('../models/User.js');


module.exports = async (token)=> {
    const decoded = jwt.verify(token, 'tokenPassword');
    const user = await User.findOne({ _id: decoded.user_id });
    return user;
}