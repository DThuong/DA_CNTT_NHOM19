const mongoose = require('mongoose');

var orderSchema = new mongoose.Schema({
    products: [
        {
            product: {type: mongoose.Types.ObjectId, ref: 'Product'},
            count: Number,
            color: String
        }
    ],
    status:{
        type:String,
        default: 'pending',
        enum: ['cancelled', 'succeeded', 'pending']
    },
    total: Number,
    coupon: {
        type: mongoose.Types.ObjectId,
        ref: 'Coupon'
    },
    orderBy:{
        type:String,
        required:true,
    },
});

//Export the model
module.exports = mongoose.model('Order', orderSchema);