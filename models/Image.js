const { DataTypes } = require("sequelize");
const sequelize = require("../config/dbConfig");
const Image = sequelize.define("Image", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  url: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
});

module.exports = { Image };
