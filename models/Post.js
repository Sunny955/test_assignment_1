const { DataTypes, Sequelize } = require("sequelize");
const sequelize = require("../config/dbConfig");
const Post = sequelize.define("Post", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.fn("NOW"),
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.fn("NOW"),
    onUpdate: Sequelize.fn("NOW"),
  },
});

module.exports = { Post };
