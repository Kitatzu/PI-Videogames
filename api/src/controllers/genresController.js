const { Genres, API_KEY } = require("../db.js");
const axios = require("axios");

async function getGenres(req, res) {
  try {
    const genresInDb = await Genres.findAll();

    if (genresInDb.length) return res.status(200).json(genresInDb);

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

    const allGenres = genres.map((g) => {
      return {
        name: g.name,
      };
    });

    res.status(200).json(allGenres);
  } catch (error) {
    res.status(500).json(error);
    console.log(error);
  }
}

module.exports = {
  getGenres,
};
