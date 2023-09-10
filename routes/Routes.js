const express = require("express");
const { rootRouter, productRouter, memberRouter } = require("./route");

const router = express.Router();

router.use("/", rootRouter);
router.use("/product", productRouter);
router.use("/member", memberRouter);

module.exports = router;
 