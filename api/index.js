const app = require("./src/app.js");
const { PORT } = process.env;
const { conn } = require("./src/db.js");

app.listen(PORT, () => {
  console.log(`listening at ${PORT}`);

  try {
    conn
      .sync({ force: true })
      .then()
      .catch((e) => {
        console.log(e);
      });
  } catch (error) {
    console.log(error);
  }
});
