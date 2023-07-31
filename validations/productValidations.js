const {body} = require("express-validator");
module.exports = [body("title").not().isEmpty().trim().escape().withMessage("Title is required"),
body("price").not().isEmpty().isInt({gt:0}).trim().escape().withMessage("Enter a valid input"),
body("discount").not().isEmpty().isInt({min:0,max:99}).trim().escape().withMessage("Enter a valid input"),
body("stock").not().isEmpty().isInt({gt:0}).trim().escape().withMessage("Enter a valid input"),
body("category").not().isEmpty().trim().escape().withMessage("Category is required"),
body("description").not().isEmpty().trim().escape().withMessage("Description is required")];