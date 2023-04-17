const { Videogames, Platforms, Genres, API_KEY } = require("../db.js");
const axios = require("axios");

async function getVideogames(req, res) {
  const { name } = req.query;

  try {
    let videogamesInDb = await Videogames.findAll({
      include: [
        {
          model: Platforms,
          attributes: ["name"],
          through: { attributes: [] },
        },
        {
          model: Platforms,
          attributes: ["name"],
          through: { attributes: [] },
        },
      ],
    });

    if (name) {
      let apiSearch = await axios.get(
        `https://api.rawg.io/api/games?search=${name}&key=${API_KEY}`
      );

      if (!apiSearch.data.count)
        return res
          .status(400)
          .json(`the game with this name ${name} is not found`);

      let newGame = apiSearch.data.results.map((g) => {
        return {
          id: g.id,
          name: g.name,
          rating: g.rating,
          background_image: g.background_image,
          genres: g.genres.map((ele) => ele.name),
          platforms: g.platforms.map((ele) => ele.platform.name),
          released: g.released,
        };
      });

      let searchInDb = videogamesInDb.filter((game) =>
        game.name.toLoweCase().include(name.toLoweCase())
      );

      const apiAndDb = [...searchInDb, ...newGame.splice(0, 15)];

      return res.status(200).json(apiAndDb);
    } else {
      let pages = 0;
      let apiAndDbGames = [...videogamesInDb];
      let response = await axios.get(
        `https://api.rawg.io/api/games?key=${API_KEY}`
      );

      while (pages < 6) {
        pages++;

        const apiGame = response.data.results.map((g) => {
          return {
            id: g.id,
            name: g.name,
            rating: g.rating,
            background_image: g.background_image,
            genres: g.genres.map((ele) => ele.name),
            platforms: g.platforms.map((ele) => ele.platform.name),
            released: g.released,
          };
        });
        apiAndDbGames = [...apiAndDbGames, ...apiGame];
        response = await axios.get(response.data.next);
      }
      res.status(200).json(apiAndDbGames);
    }
  } catch (error) {
    res.status(500).json(error);
  }
}

//--------------------------------------------------------------------------

async function getVideogameById(req, res) {
  const { idGame } = req.params;

  try {
    if (idGame.includes("-")) {
      let databaseGame = await Videogames.findByPk(id, {
        include: [
          {
            model: Platforms,
            attributes: ["name"],
            through: { attributes: [] },
          },
          {
            model: Platforms,
            attributes: ["name"],
            through: { attributes: [] },
          },
        ],
      });

      databaseGame.genres = databaseGame.genres.map((ele) => ele.name);
      databaseGame.platforms = databaseGame.platforms.map((ele) => ele.name);

      res.status(200).json(databaseGame);
    } else {
      let response = await axios.get(
        `https://api.rawg.io/api/games/${idGame}?key=${API_KEY}`
      );

      if (response.data) {
        let game = {
          id: response.data.id,
          name: response.data.name,
          rating: response.data.rating,
          background_image: response.data.background_image,
          description_raw: response.data.description_raw,
          genres: response.data.genres.map((ele) => ele.name),
          platforms: response.data.platforms.map((ele) => ele.platform.name),
          released: response.data.released,
        };

        res.status(200).json(game);
      } else {
        res.status(400).json("game not found");
      }
    }
  } catch (error) {
    res.status(500).json(error);
    console.log(error);
  }
}

async function createVideogame(req, res) {}

async function deleteVideogame(req, res) {}

async function updateVideogame(req, res) {}

module.exports = {
  getVideogames,
  getVideogameById,
  createVideogame,
  deleteVideogame,
  updateVideogame,
};
