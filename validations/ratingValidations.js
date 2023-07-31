const {body} = require("express-validator");
module.exports = [body("userRating").not().isEmpty().trim().escape().withMessage("Add rating")];