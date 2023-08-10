const { Schema, model } = require('mongoose');


const ItemSchema = new Schema({
    title: {
        type:String,
        required:true,
    },
    price: {
        type:Number,
        required:true,
    },
    imageUrl: {
        type:String,
        required:true,
    },
    reviews: {
        type: Array,
        default: []
    },
    infoAbout: {
        type:String,
        default:''
    }
})

module.exports = model('Item', ItemSchema);