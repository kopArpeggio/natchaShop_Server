const express = require("express");
const {
  rootRouter,
  productRouter,
  memberRouter,
  uploadRouter,
  orderRouter,
} = require("./route");

const router = express.Router();

router.use("/", rootRouter);
router.use("/product", productRouter);
router.use("/member", memberRouter);
router.use("/upload", uploadRouter);
router.use("/order", orderRouter);

module.exports = router;
