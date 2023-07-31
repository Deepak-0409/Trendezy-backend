const express = require("express");
const router = new express.Router();
const Product = require("../controllers/Product")
const Authorization = require("../services/Authorization");
const productValidations = require("../validations/productValidations");
const HomeProducts = require("../controllers/HomeProducts");

router.post("/create-product",Authorization.authorized,Product.create);
router.get("/products/:page?",Authorization.authorized,Product.get);
router.get("/product/:id",Product.getProduct);
router.get("/category-products/:name/:page?",HomeProducts.categoryProducts);
router.get("/search-products/:keyword/:page?",HomeProducts.categoryProducts);
router.put("/product",[Authorization.authorized,productValidations],Product.updateProduct);
router.delete("/delete/:id",Authorization.authorized,Product.deleteProduct);

module.exports = router;