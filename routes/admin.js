const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const keys = require("../config/keys");
const passport = require("passport");
const bodyParser = require("body-parser");
const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
const { config } = require('dotenv');
config();


app.use(passport.initialize());
require("../config/passport")(passport);

const Product = require("../models/Product");

router.post("/login", (req, res) => {
    const email = req.body.user;
    const password = req.body.pass;
    if (email == process.env.email && password == process.env.password) {
        const payload = { mail: email };
        jwt.sign(payload, keys.secretOrKey, { expiresIn: 36000 }, (err, token) => {
            res.status(200).json({ token: "Bearer " + token, msg: "Login Successfull !" })
        });
    }
    else {
        res.status(400).json({ err: "Invalid Credentials" });
    }

})

router.post("/addProduct",passport.authenticate('jwt', { session: false }),  async (req, res) => { 
    const newProduct = new Product({
        imgUrl: req.body.galleryImg,
        category: req.body.category,
        size: req.body.size,
        price: req.body.price
    })
    newProduct.save()
        .then(() => {
            res.status(200).json({ msg: "Product added successfully" });
        })
        .catch(err => {
            res.json(err);
        })
})


module.exports = router;