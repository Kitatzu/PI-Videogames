const { Router } = require("express");
const {
  getVideogames,
  getVideogameById,
  createVideogame,
  deleteVideogame,
  updateVideogame,
} = require("../controllers/videogamesController.js");
const router = Router();

router.get("/", getVideogames);
router.get("/:idGame", getVideogameById);
router.post("/", createVideogame);
router.delete("/:idGame", deleteVideogame);
router.put("/:idGame", updateVideogame);

module.exports = router;
