const mongoose = require('mongoose');

var productSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        trim: true // bỏ khoảng cách 2 đầu khi lưu thông tin vào db
    },
    slug:{ // dong-ho-thong-minh
        type:String,
        // unique:true,
        lowercase: true
    },
    description:{
        type:Array,
        required:true,
    },
    thumb: {
        type:String,
        required:true,
    },
    brand:{
        type:String,
        required:true,
    },
    price:{
        type:Number,
        required:true,
    },
    category:{ // thuộc danh mục nào ?
        type:String,
        required:true,
    },
    quantity:{ // số lượng
        type: Number,
        default : 0,
    },
    sold:{ // số mặt hàng đã bán
        type: Number,
        default: 0,
    },
    images: {
        type: Array
    },
    color: {
        type: String,
        required: true,
    },
    ratings: [
        {
            star: {type: Number},
            postedBy: {type: mongoose.Types.ObjectId, ref: 'User'},
            comment: {type: String}
        }
    ],
    totalRating: {
        type: Number,
        default: 0
    }
},{
    timestamps: true // thêm createdAt và updatedAt
});

//Export the model
module.exports = mongoose.model('Product', productSchema);