const { Schema, model } = require('mongoose');


const CategorySchema = new Schema({
    category: {
        type:String,
        required:true,
    },
    categories: {
        type:Array,
        default:[],
    }
})

module.exports = model('Category', CategorySchema);