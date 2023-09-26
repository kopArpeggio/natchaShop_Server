const express = require("express");
const { productController } = require("../../controllers");
const passportJWT = require("../../middleware/passportJWT");

const router = express.Router();

router.get("/get-all-product", productController.getAllProduct);
router.put("/update-product-by-id/:id", productController.updateProduct);
router.post("/delete-product-by-id", productController.deleteProduct);
router.post("/create-product", productController.createProduct);
router.get("/get-product-by-id/:id", productController.getProductById);

module.exports = router;
