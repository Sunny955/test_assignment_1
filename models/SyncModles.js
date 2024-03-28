const { User } = require("./User");
const { Post } = require("./Post");
const { Image } = require("./Image");

// Sync all models with the database
async function syncModels() {
  try {
    await User.sync({ alter: true });
    await Post.sync({ alter: true });
    await Image.sync({ alter: true });
    console.log("All models synchronized successfully");
  } catch (error) {
    console.error("Error synchronizing models:", error);
  }
}

module.exports = { syncModels };
