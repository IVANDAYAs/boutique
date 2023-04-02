const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const productSchema = new Schema({
    imgUrl:{
        type : String
    },
    category:{
        type : String
    },
    size:{
        type : String
    },
    price:{
        type : Number
    }
});

module.exports = mongoose.model("Product",productSchema,"products");