const express = require("express");
const { rootController } = require("../../controllers");
const router = express.Router();

router.get("/migrate", rootController.migrate);

module.exports = router;
