const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const User = require('../models/User');
const Order = require('../models/Order');
const Product = require('../models/Product');

class PaymentController {
    async paymentCheckout(req, res) {
        const { cart, id } = req.body;
        const user = await User.findById(id);
        if (!user) {
            return res.status(400).json({ error: "User not found" });
        }

        const cartData = cart.map(item => {
            return {

                _id: item._id,
                title: item.title,
                quantity: item.quantity,
                price: item.price,
                size: item.size,
                color: item.color,
                userId: user._id,
            }
        });

        const customer = await stripe.customers.create({
            email: user.email,
            metadata: {
                orderData: JSON.stringify(cartData), 
            }
        })

        const session = await stripe.checkout.sessions.create({

            shipping_address_collection: {
                allowed_countries: ['IN'],
            },
            shipping_options: [
                {
                    shipping_rate_data: {
                        type: 'fixed_amount',
                        fixed_amount: {
                            amount: 0,
                            currency: 'inr',
                        },
                        display_name: 'Free Shipping',
                        delivery_estimate: {
                            minimum: {
                                unit: 'business_day',
                                value: 2,
                            },
                            maximum: {
                                unit: 'business_day',
                                value: 5,
                            }
                        }
                    }
                },
                {
                    shipping_rate_data: {
                        type: 'fixed_amount',
                        fixed_amount: {
                            amount: 100 * 100,
                            currency: 'inr',
                        },
                        display_name: 'Express Shipping',
                        delivery_estimate: {
                            minimum: {
                                unit: 'business_day',
                                value: 1,
                            },
                            maximum: {
                                unit: 'business_day',
                                value: 1,
                            },
                        },
                    },
                },
            ],
            line_items: cart.map(item => {
                const percentage = item.discount / 100;
                let discountPrice = item.price - item.price * percentage;
                discountPrice = parseFloat(discountPrice.toFixed(2));
                return {
                    price_data: {
                        currency: 'inr',
                        product_data: {
                            name: item.title,
                        },
                        unit_amount: discountPrice * 100,
                    },
                    quantity: item.quantity,

                }
            }),
            customer: customer.id,
            mode: 'payment',
            success_url: `${process.env.CLIENT}/user?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.CLIENT}/cart`,
        });

        res.json({ url: session.url });
    }
    async checkoutSession(request, response) {

        const sig = request.headers['stripe-signature'];
        let event;

        try {
            event = stripe.webhooks.constructEvent(request.rawBody, sig, process.env.STRIPE_ENDPOINT_SECRET);
        } catch (err) {
            response.status(400).send(`Webhook Error: ${err.message}`);
            return;
        }

        switch (event.type) {
            case 'payment_intent.succeeded':
                const paymentIntentSucceeded = event.data.object;
                break;
            case 'checkout.session.completed':
                const data = event.data.object;
                let customer = await stripe.customers.retrieve(data.customer);
                customer = JSON.parse(customer?.metadata?.orderData);
                customer.forEach(async ctr => {
                    try {
                        let reviewStatus=false;
                        const findOrder = await Order.findOne({productId: ctr._id, userId: ctr.userId}).where('review').equals(true);
                        if(findOrder)
                        {
                            reviewStatus=true;
                        }

                        await Order.create({
                            productId: ctr._id,
                            userId: ctr.userId,
                            size: ctr.size,
                            color: ctr.color,
                            quantities: ctr.quantity,
                            address: data.shipping_details.address,
                            review: reviewStatus
                        });
                        const product = await Product.findById(ctr._id);
                        if(product)
                        {
                            let stock = product.stock - ctr.quantity;
                            if(stock<0)
                            {
                                stock = 0;
                            }
                            await Product.findByIdAndUpdate(ctr._id,{stock: stock}, {new: true});
                        }
                    } catch (error) {
                        console.log(error.message)
                        return response.status(500).json('Server Internal Error');
                    }
                })
                break;
            default:
                console.log(`Unhandled event type ${event.type}`);
        }
        response.send();
    }
    async verifyPayment(req, res) {
        const { id } = req.params;
        try {
            const session = await stripe.checkout.sessions.retrieve(id);
            return res.status(200).json({message: "Payment is successful", status: session.payment_status});
        } catch (error) {
            return res.status(500).json(error.message);
        }
    }
}

module.exports = new PaymentController();