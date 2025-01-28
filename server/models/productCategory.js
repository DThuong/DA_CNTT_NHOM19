const mongoose = require('mongoose');

var ProductCategorySchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        unique:true,
        index:true,
    },
    brand: {
        type: String,
        required:true,
    }
}, {
    timestamps: true
});

//Export the model
module.exports = mongoose.model('ProductCategory', ProductCategorySchema);