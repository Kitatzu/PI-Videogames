const { Videogames, Platforms, Genres, API_KEY } = require("../db.js");
const axios = require("axios");

async function getVideogames(req, res) {
  const { name } = req.query;

  try {
    let videogamesInDb = await Videogames.findAll({
      include: [
        {
          model: Genres,
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
      let databaseGame = await Videogames.findByPk(idGame, {
        include: [
          {
            model: Genres,
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

async function createVideogame(req, res) {
  let {
    background_image,
    name,
    released,
    rating,
    description_raw,
    genres,
    platforms,
  } = req.body;

  try {
    const newGame = await Videogames.create({
      background_image,
      name,
      description_raw,
      released,
      rating,
    });

    const gameGenres = await Genres.findAll({ where: { name: genres } });
    const gamePlatforms = await Platforms.findAll({
      where: { name: platforms },
    });

    await newGame.addGenres(gameGenres);
    await newGame.addPlatforms(gamePlatforms);

    res.status(200).json(newGame);
  } catch (error) {
    res.status(500).json(error);
  }
}

async function deleteVideogame(req, res) {
  let { idGame } = req.params;

  try {
    let findGame = await Videogames.findByPk(idGame);
    await findGame.destroy();
    res.status(200).json(`the game ${findGame.name} is deleted`);
  } catch (error) {
    res.status(500).json(error);
    console.log(error);
  }
}

async function updateVideogame(req, res) {
  const {} = req.params;
  const {} = req.body;

  try {
  } catch (error) {}
}

module.exports = {
  getVideogames,
  getVideogameById,
  createVideogame,
  deleteVideogame,
  updateVideogame,
};
