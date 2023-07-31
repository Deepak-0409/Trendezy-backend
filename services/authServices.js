const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");
const {JWT_KEY} = require("../config/envConfig");

module.exports.hashedPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password,salt);
    return hashed;
}

module.exports.comparePassword = async (password,dbPassword) => {
    return await bcrypt.compare(password,dbPassword);
}

module.exports.createToken = (user)=>{
    return JWT.sign(user, JWT_KEY, {
        expiresIn: "7d"
    });
}