const app = require("./src/app.js");
const { PORT } = process.env;
const { conn } = require("./src/db.js");
const {
  initialGenres,
  initialPlatforms,
} = require("./src/utilities/initial.js");

app.listen(PORT, () => {
  console.log(`listening at ${PORT}`);

  try {
    conn
      .sync({ force: true })
      .then((response) => {
        initialGenres();
        initialPlatforms();
      })
      .catch((e) => {
        console.log(e);
      });
  } catch (error) {
    console.log(error);
  }
});
