const {Schema, model, Types} = require('mongoose');

const reviewSchema = new Schema({
    rating: {
        type: Number,
        default: 1,
    },
    comment: {
        type: String
    },
    productId: {type: Types.ObjectId, ref: "product"},
    userId: {type: Types.ObjectId, ref: "user"}
},{
    timestamps: true
})

const reviewModel = model("Review", reviewSchema);
module.exports = reviewModel;