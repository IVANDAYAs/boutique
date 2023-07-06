const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const productSchema = new Schema({
    imgUrl: {
        type: String
    },
    category: {
        type: String
    },
    size: {
        type: Array
    },
    price: {
        type: Object
    },
    color: {
        type: Object
    }
});

module.exports = mongoose.model("Product", productSchema, "products");