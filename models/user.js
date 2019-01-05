var mongoose = require('mongoose');
var userSchema = new mongoose.Schema({
    "userId":Number,
    "userName":String,
    "userPwd":String,
    "confirmPwd":String,
    "orderList":Array,
    "cartList":[
        {
            "details":[
                {
                    "productId":Number,
                    "productName":String,
                    "salePrice":Number,
                    "num":Number,
                    "smImg":Array,
                    "detailsImagebag":Array,
                    "checked":String,
                    "isMode":Boolean,
                }
            ]
        }
    ],
    "purchaseList":[
        {
            "details":[
                {
                    "productId":Number,
                    "productName":String,
                    "salePrice":Number,
                    "num":Number,
                    "smImg":Array,
                    "detailsImagebag":Array,
                    "checked":String,
                    "isMode":Boolean,
                }
            ]
        }
    ],
    "addressList":[
        {
            'addressId':Number,
            'cityName':String,
            'userName':String,
            'streeName':String,
            'postCode':String,
            'tel': Number,
            'isDefault':Boolean
        }
    ]
})

module.exports = mongoose.model('user',userSchema)