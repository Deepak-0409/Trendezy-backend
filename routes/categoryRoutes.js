const express = require("express");
const categoryValidations = require("../validations/categoryValidations");
const router = express.Router();
const categoryController = require("../controllers/Category");
const Authorization = require("../services/Authorization")

router.post("/create-category",[categoryValidations,Authorization.authorized],categoryController.create);
router.get("/categories/:page",Authorization.authorized,categoryController.categories);
router.get("/fetch-category/:id",Authorization.authorized,categoryController.fetchCategory);
router.get("/allcategories",categoryController.allCategories);
router.get("/random-categories",categoryController.randomCategories);
router.put("/update-category/:id",[categoryValidations,Authorization.authorized],categoryController.updateCategory);
router.delete("/delete-category/:id",Authorization.authorized,categoryController.deleteCategory);
module.exports = router;