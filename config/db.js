const mongoose = require("mongoose");
const env = require("./envConfig");

const connect = async () => {

    try{
        mongoose.set('strictQuery', true);
        await mongoose.connect(env.URL);
        console.log("Database Connected Successfully");

    } catch(error) {
        console.log(error.message);
        process.exit;
    }

}

module.exports = connect;