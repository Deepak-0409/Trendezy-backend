require('dotenv').config()

module.exports={
    PORT: process.env.PORT,
    URL: process.env.URL,
    JWT_KEY: process.env.JWT_SECRET
}