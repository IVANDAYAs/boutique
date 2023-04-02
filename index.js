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
app.use("/admin", admin);

app.get("/products", async (req,res)=>{
    try {
        const products = await Product.find({ });
        res.status(200).json(products);
        } 
    catch (err) {
        console.log(err);
    }
})

app.listen(process.env.PORT || 4000, () => {
    console.log("started");
});