const { Router } = require("express");
const router = Router();
const genresRoutes = require("../routes/genresRoutes");
const platformsRoutes = require("../routes/platformsRoutes");

router.use("/genres", genresRoutes);
router.use("/platforms", platformsRoutes);

module.exports = router;
