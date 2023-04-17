const { Genres, Platforms, API_KEY } = require("../db.js");
const axios = require("axios");

async function initialGenres() {
  try {
    const genresInDb = await Genres.findAll();

    if (genresInDb.length) return;

    const genresInApi = await axios.get(
      `https://api.rawg.io/api/genres?key=${API_KEY}`
    );

    const genres = genresInApi.data.results;

    genres.forEach(async (g) => {
      await Genres.findOrCreate({
        where: {
          name: g.name,
        },
      });
    });
  } catch (error) {
    console.log(error);
  }
}

async function initialPlatforms() {
  try {
    const platformsInDb = await Platforms.findAll();

    if (platformsInDb.length) return;

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
  } catch (error) {
    console.log(error);
  }
}

module.exports = { initialGenres, initialPlatforms };
