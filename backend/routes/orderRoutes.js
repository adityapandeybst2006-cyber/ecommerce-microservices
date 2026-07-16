const express = require("express");
const router = express.Router();

const {
    createOrder,
    getOrders,
    getOrder,
    deleteOrder,
    getUserOrders 
} = require("../controllers/orderController");


router.post("/", createOrder);

router.get("/", getOrders);


router.get("/user/:userId", getUserOrders);

router.get("/:id", getOrder);

router.delete("/:id", deleteOrder);

module.exports = router;