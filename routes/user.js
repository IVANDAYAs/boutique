const express = require("express");
const router = express.Router();
const keys = require("../config/keys");
const bodyParser = require("body-parser");
const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
const Product = require("../models/Product");

//razorpay api

const Razorpay = require("razorpay");
const instance = new Razorpay({
    key_id: keys.RAZOR_PAY_KEY_ID,
    key_secret: keys.RAZOR_PAY_KEY_SECRET,
});

router.get("/products", async (req, res) => {
    await Product.find({})
        .then((data) => {
            res.status(200).json(data);
        })
        .catch((err) => {
            res.json(err)
        })
})

router.post("/checkout", async (req, res) => {
    
    const checkoutArray = req.body.checkoutArray;
    var temp = 0;
    checkoutArray.map(async (data, i) => {
        var flag = await Product.findOne({ _id: data.productID });
        var flag1 = data.size;
        temp = Number(temp) + Number(flag.price[flag1]);

        if ((checkoutArray.length) === i + 1) {
            payment();
        }

    })

    function payment() {
       
        const options = {
            amount: temp * 100, // amount == Rs 10
            currency: "INR",
            receipt: "receipt#1",
            payment_capture: 0,
            // 1 for automatic capture // 0 for manual capture
        };
        instance.orders.create(options, async function (err, order) {
            if (err) {
                return res.status(500).json({
                    message: "Something Went Wrong",
                });
            }
            return res.status(200).json(order);

        });
    }
})


router.post("/capture/:paymentId", (req, res) => {
    try {
        return request(
            {
                method: "POST",
                url: `https://${keys.RAZOR_PAY_KEY_ID}:${keys.RAZOR_PAY_KEY_SECRET}@api.razorpay.com/v1/payments/${req.params.paymentId}/capture`,
                form: {
                    amount: 10 * 100, // amount == Rs 10 // Same As Order amount
                    currency: "INR",
                },
            },
            async function (err, response, body) {
                if (err) {
                    return res.status(500).json({
                        message: "Something Went Wrong",
                    });
                }
                console.log("Status:", response.statusCode);
                console.log("Headers:", JSON.stringify(response.headers));
                console.log("Response:", body);
                return res.status(200).json(body);
            });
    } catch (err) {
        return res.status(500).json({
            message: "Something Went Wrong",
        });
    }
});

module.exports = router;