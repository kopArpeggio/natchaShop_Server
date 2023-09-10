const express = require("express");
const { productController } = require("../../controllers");

const router = express.Router();

router.get("/get-all-product", productController.getAllProduct);
router.put("/update-product-by-id/:id", productController.updateProduct);
router.delete("/delete-product-by-id/:id", productController.deleteProduct);
router.post("/create-product", productController.createProduct);


module.exports = router;
