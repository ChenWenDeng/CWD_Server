var mongoose = require('mongoose')
var Schema = mongoose.Schema

var productSchema = new Schema({
    "productId":Number,
	"productName":String,
	"salePrice":Number,
    "productImage":String,
    "direction":String,
    "typeName": Array,
    "details":[
        {
            "productId":Number,
            "productName":String,
            "salePrice":Number,
            "num":Number,
            "smImg":Array,
            "detailsImagebag":Array
        }
    ]
})

module.exports = mongoose.model('Good',productSchema)