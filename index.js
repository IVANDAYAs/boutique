const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
// DB CONFIG
const db = require("./config/keys.js").mongoURI;
const Product = require("./models/Product");

mongoose
    .connect(db)
    .then(() => console.log("Database connected succesfully"))
    .catch((err) => console.log(err));


const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));


const admin = require("./routes/admin");
const user = require("./routes/user");
app.use("/admin", admin);
app.use("/user", user);

app.listen(process.env.PORT || 4000, () => {
    console.log("started");
});