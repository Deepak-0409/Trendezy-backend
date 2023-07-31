const Order = require('../models/Order');
const Review = require('../models/Review')
const Product = require('../models/Product');
const {validationResult} = require("express-validator")

class Orders {
    async getOrders(req, res) {
        const query = req.query;
        const perPage = 2; 
        const skip = (query.page -1)*perPage;
        const option = query.userId ? {userId: query.userId} : {};
        try {
            const count = await Order.find(option).countDocuments();
            const response = await Order.find(option).populate("productId","-colors -sizes -createdAt -updatedAt -description -stock -image2 -image3 -__v").populate("userId","-createdAt -updatedAt -__v -admin -password").skip(skip).limit(perPage).sort({createdAt: -1})
            return res.status(200).json({orders:response, perPage, count});
        } catch (error) {
            console.log(error.message);
        }
    }
    async getOrderDetails(req, res) {
        const {id} = req.params;
        
        try {
            const order = await Order.findById(id).populate("productId","-colors -sizes -createdAt -updatedAt -description -stock -image2 -image3 -__v").populate("userId","-createdAt -updatedAt -__v -admin -password");
            return res.status(200).json({order : order});
        } catch (error) {
            console.log(error.message);
            return res.status(500).json({errors: error});
        }
    }
    async updateOrder(req, res) {
        const {id,status} = req.query;
        let option={};
        if(status==="dispatched")
        {
            option = {status:true}
        }
        else if(status==="received")
        {
            option={received:true}
        }
        
        try {
            const upatedOrder = await Order.findByIdAndUpdate(id,option, {new: true});
            return res.status(200).json({msg: `Order has been ${status}`});
        } catch (error) {
            console.log(error.message);
            return res.status(500).json({errors: error});
        }
    }
    async postReview(req, res) {
        const errors = validationResult(req);
        const {userRating,comment,user,product,order} = req.body;
        if(errors.isEmpty())
        {
            try {
                const createdReview = await Review.create({
                    rating: parseInt(userRating),
                    comment: comment,
                    productId: product,
                    userId: user
                });
                await Order.findByIdAndUpdate(order,{review:true},{new:true});
                await Product.findByIdAndUpdate(product,{$push: {reviews: createdReview._id}});
                return res.status(201 ).json({message: "Review has been posted"});  
            } catch (error) {
                return res.status(500).json({errors: error.message});
            }
        }  
        else
        {
            return res.status(400).json({errors: errors.array()});
        }
    }

}

module.exports = new Orders;