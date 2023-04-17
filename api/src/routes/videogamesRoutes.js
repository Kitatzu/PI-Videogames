const { Router } = require("express");
const {
  getVideogames,
  getVideogameById,
} = require("../controllers/videogamesController.js");
const router = Router();

router.get("/", getVideogames);
router.get("/:idGame", getVideogameById);

module.exports = router;
