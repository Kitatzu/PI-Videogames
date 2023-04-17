const { Platforms, API_KEY } = require("../db.js");
const axios = require("axios");

async function getPlatforms(req, res) {
  try {
    const platformsInDb = await Platforms.findAll();

    if (platformsInDb.length) return platformsInDb;

    const platformsInApi = await axios.get(
      `https://api.rawg.io/api/platforms?key=${API_KEY}`
    );
    const platforms = platformsInApi.data.results;
    platforms.forEach(async (p) => {
      await Platforms.findOrCreate({
        where: {
          name: p.name,
        },
      });
    });

    const allPlatforms = platforms.map((g) => {
      return {
        name: g.name,
      };
    });

    return res.status(200).json(allPlatforms);
  } catch (error) {
    res.status(500).json(error);
  }
}

module.exports = { getPlatforms };
