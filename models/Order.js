const {Schema, model, Types} = require('mongoose');

const orderSchema = new Schema({
    productId: {type: Types.ObjectId, ref: "product"},
    userId: {type: Types.ObjectId, ref: "user"},
    size: {
        required: false,
        type: String
    },
    color: {
        required: false,
        type: String
    },
    quantities: {
        required: false,
        type: Number
    },
    address: {
        required: true,
        type: Map
    },
    status: {
        default: false,
        type: Boolean
    },
    received: {
        default: false,
        type: Boolean
    },
    review: {
        default: false,
        type: Boolean
    }
},{timestamps: true});

const OrderModel = model("Order", orderSchema);
module.exports = OrderModel;
