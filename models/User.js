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
    },
    bucket: {
        type:Array,
        default: []
    },
    desireItems: {
        type:Array,
        default:[]
    },
    phone: {
        type: String,
        required:true,
    }
});

module.exports = model('User', UserSchema);