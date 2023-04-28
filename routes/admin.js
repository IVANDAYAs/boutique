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
const sharp = require('sharp');
const multer = require('multer');

const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please upload a photo!'));
        }
        cb(undefined, true);
    }
});

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

router.post("/addProduct", passport.authenticate('jwt', { session: false }), upload.single('img'), async (req, res) => {
    const buffer = await sharp(req.file.buffer).png().toBuffer();
    const b64 = Buffer.from(buffer).toString('base64');
    // const mimeType = 'image/png';
    const newProduct = new Product({
        imgUrl: b64,
        category: req.body.category,
        size: req.body.size,
        price: req.body.price
    })
    newProduct.save()
        .then(() => {
            res.status(200).json({ msg: "Product added successfully" });
            // res.send(`<img src="data:${mimeType};base64,${b64}" />`);
        })
        .catch(err => {
            res.json(err);
        })
})



module.exports = router;