const { Router } = require("express");
const router = Router();
const videogamesRoutes = require("../routes/videogamesRoutes");
const genresRoutes = require("../routes/genresRoutes");
const platformsRoutes = require("../routes/platformsRoutes");

router.use("/videogames", videogamesRoutes);
router.use("/genres", genresRoutes);
router.use("/platforms", platformsRoutes);

module.exports = router;
