const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema({

    title: {
        required: true,
        type: String 
    },
    price: {
        required: true,
        type: Number
    },
    discount: {
        required: true,
        type: Number 
    },
    stock: {
        required: true,
        type: Number
    },
    category: {
        required: true,
        type: String
    },
    colors: {
        type: [Map]
    },
    sizes: {
        type: [Map],
        of: [String]
    },
    image1: {
        required: true,
        type: String
    },
    image2: {
        required: true,
        type: String
    },
    image3: {
        required: true,
        type: String
    },
    description: {
        required: true,
        type: String
    },
    reviews: [{type: mongoose.Types.ObjectId, ref: "Review"}],
},{timestamps: true})
const Product = mongoose.model("product",productSchema);
module.exports = Product;