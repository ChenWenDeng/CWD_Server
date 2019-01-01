var mongoose = require('mongoose');
var userSchema = new mongoose.Schema({
    "userId":Number,
    "userName":String,
    "userPwd":String,
    "confirmPwd":String,
    "orderList":Array,
    "cartList":[
        {
            // "productId":Number,
            // "productName":String,
            // "salePrice":Number,
            // "smImg":Array,
            // "checked":String,
            // "num":String
            "details":[
                {
                    "productId":Number,
                    "productName":String,
                    "salePrice":Number,
                    "num":Number,
                    "smImg":Array,
                    "detailsImagebag":Array,
                    "checked":Number,
                }
            ]
        }
    ],
    "addressList":Array
})

module.exports = mongoose.model('user',userSchema)