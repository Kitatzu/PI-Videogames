const { Router } = require("express");
const { getVideogames } = require("../controllers/videogamesController.js");
const router = Router();

router.use("/", getVideogames);

module.exports = router;
