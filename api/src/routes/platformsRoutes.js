const { Router } = require("express");
const { getPlatforms } = require("../controllers/platformsController.js");
const router = Router();

router.get("/", getPlatforms);

module.exports = router;
