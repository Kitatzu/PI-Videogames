const { Router } = require("express");
const { getGenres } = require("../controllers/genresController");
const router = Router();

router.get("/", getGenres);

module.exports = router;
