const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define("videogames", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    background_image: {
      type: DataTypes.STRING,
    },
    releaseDate: {
      type: DataTypes.STRING,
    },
    rating: {
      type: DataTypes.DECIMAL,
    },
    inDb: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
    },
  });
};
