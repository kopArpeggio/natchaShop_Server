const express = require("express");
const { orderController } = require("../../controllers");
const passportJWT = require("../../middleware/passportJWT");

const router = express.Router();

router.post(
  "/create-order",
  [passportJWT.isLogin],
  orderController.createOrder
);

router.get("/get-order", [passportJWT.isLogin], orderController?.getAllOrder);
router.get(
  "/get-order-by-id/:id",
  [passportJWT.isLogin],
  orderController?.getOrderById
);
router.put(
  "/update-order-by-id",
  [passportJWT.isLogin],
  orderController?.updateOrderById
);

module.exports = router;
