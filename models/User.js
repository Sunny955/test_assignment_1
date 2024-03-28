const { DataTypes, Sequelize } = require("sequelize");
const sequelize = require("../config/dbConfig");
const { Image } = require("./Image");
const { Post } = require("./Post");

const User = sequelize.define("User", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  username: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.fn("NOW"),
  },
});

User.hasMany(Post, { foreignKey: "authorId" });
Post.belongsTo(User, { foreignKey: "authorId" });
Post.hasMany(Image, { foreignKey: "postId" });
Image.belongsTo(Post, { foreignKey: "postId" });

module.exports = { User };
