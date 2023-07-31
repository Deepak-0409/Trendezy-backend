const {body} = require("express-validator");

module.exports.registerValidations = [
    body("name").not().isEmpty().trim().escape().withMessage("Name is required"),
    body("email").isEmail().normalizeEmail().trim().escape().withMessage("Email is required"),
    body("password").isLength({min: 5}).withMessage("Password should be atleast 5 characters long")
]

module.exports.loginValidations = [
    body("email").isEmail().normalizeEmail().trim().escape().withMessage("Email is required"),
    body("password").not().isEmpty().withMessage("Password is required")
]