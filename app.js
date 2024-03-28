require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const { syncModels } = require("./models/SyncModles");

syncModels();

const authRoutes = require("./routes/authUser");
const postRoutes = require("./routes/postRoutes");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/api/v1/user", authRoutes);
app.use("/api/v1/blog", postRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
