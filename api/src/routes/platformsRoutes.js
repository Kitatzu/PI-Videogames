const { Router } = require("express");
const { getPlatforms } = require("../controllers/platformsController.js");
const router = Router();

router.use("/", getPlatforms);

module.exports = router;
