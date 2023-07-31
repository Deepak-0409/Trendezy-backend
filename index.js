const express= require("express");
const env = require("./config/envConfig");
const cors = require("cors");
const connect = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const productRoutes = require("./routes/productRoutes");
const paymentRoutes = require("./routes/payment");
const orderRoutes = require("./routes/orderRoutes");
const app = express();

//Connect the database
connect();
app.use(cors());

//Stripe webhook
app.post("/api/webhook",express.json({
    verify: (req,res,buf) => {
        req.rawBody = buf.toString();
    },
}));

//Add middleware 
app.use(express.json());

app.get("/",function(req,res)
{
    res.send("hello there!!");
})

//User Routes
app.use("/api",userRoutes); 
app.use("/api",categoryRoutes);
app.use("/api",productRoutes);
app.use("/api",paymentRoutes);
app.use("/api",orderRoutes);

const port=env.PORT;
app.listen(port || 3500, function()
{
    console.log("Server is ported at port "+port); 
})