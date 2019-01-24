var mongoose = require('mongoose');
var userSchema = new mongoose.Schema({
    "userId":Number,
    "userName":String,
    "userPwd":String,
    "phone":String,
    "eliam":String,
    "confirmPwd":String,
    "createDate":String,
    "orderList":[
        {
            "orderId": String,
            'addressInfo':{
                'addressId':Number,
                'cityName':String,
                'userName':String,
                'streeName':String,
                'postCode':String,
                'tel': Number,
                'isDefault':Boolean
            },
            'goodsList':[
                {
                    "productId":Number,
                    "productName":String,
                    "salePrice":Number,
                    "num":Number,
                    "smImg":Array,
                    "detailsImagebag":Array,
                    "isMode":Boolean,
                    "checked":String,
					"colours":String,
					"sizes":String
                    
                }
            ],
            'orderStatus': String,
            'createDate' : String,
            'totalPrice' : Number
        }
    ],
    "cartList":[
        {
			"cartId":String,
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
					"colours":String,
					"sizes":String,
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
					"colours":String,
					"sizes":String
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