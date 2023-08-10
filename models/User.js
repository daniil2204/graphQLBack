const { model, Schema } = require('mongoose');

const UserSchema = new Schema({
    username: {
        type: String,
        required:true,
        default: 'userName'
    },
    email: {
        type: String,
        required:true,
        unique:true,
    },
    password: {
        type: String,
        required:true,
    },
    token: {
        type: String,
    },
    role: {
        type:String,
        default:'user'
    }
});

module.exports = model('User', UserSchema);