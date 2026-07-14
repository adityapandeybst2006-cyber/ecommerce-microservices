const express = require("express");
const router = express.Router();

const {
    createOrder,
    getOrders,
    getOrder,
    deleteOrder,
    getUserOrders // नया फ़ंक्शन इम्पोर्ट किया
} = require("../controllers/orderController");

// नए ऑर्डर बनाने के लिए
router.post("/", createOrder);

// सभी ऑर्डर्स देखने के लिए (Admin)
router.get("/", getOrders);

// किसी विशिष्ट यूजर के सारे ऑर्डर्स देखने के लिए (My Orders पेज के लिए)
router.get("/user/:userId", getUserOrders);

// किसी एक सिंगल ऑर्डर की डिटेल्स देखने के लिए
router.get("/:id", getOrder);

// ऑर्डर डिलीट करने के लिए
router.delete("/:id", deleteOrder);

module.exports = router;