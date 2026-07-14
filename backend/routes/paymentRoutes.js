const express = require("express");

const router = express.Router();

const {

chargePayment

} = require("../controllers/paymentController");

router.post("/charge", chargePayment);

module.exports = router;