const Order = require("../models/Order");

// Create Order (Updated with Shipping Address & Fake Payment logic)
exports.createOrder = async (req, res) => {
    try {
        const { userId, items, shippingAddress, paymentMethod } = req.body;

        // Validation
        if (!userId || !items || items.length === 0) {
            return res.status(400).json({
                error: "Order items required"
            });
        }

        if (!shippingAddress || !shippingAddress.street || !shippingAddress.city || !shippingAddress.state || !shippingAddress.pincode || !shippingAddress.phone) {
            return res.status(400).json({
                error: "Complete shipping address and phone number are required"
            });
        }

        if (!paymentMethod) {
            return res.status(400).json({
                error: "Payment method is required"
            });
        }

        // Calculate Total
        const total = items.reduce((sum, item) => {
            return sum + item.price * item.qty;
        }, 0);

        // Phase 1 (Fake Payment Logic)
       
        const paymentStatus = paymentMethod === "COD" ? "Pending" : "Paid";

        // Create Order in DB
        const order = await Order.create({
            userId,
            items,
            total,
            shippingAddress,
            paymentMethod,
            paymentStatus
        });

        res.status(201).json(order);

    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
};


exports.getUserOrders = async (req, res) => {
    try {
        const { userId } = req.params;
        
        
        const orders = await Order.find({ userId }).sort({ createdAt: -1 });
        
        res.json(orders);
    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
};


exports.getOrders = async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
};

// Get Single Order
exports.getOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                error: "Order Not Found"
            });
        }

        res.json(order);
    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
};

// Delete Order
exports.deleteOrder = async (req, res) => {
    try {
        await Order.findByIdAndDelete(req.params.id);
        res.json({
            message: "Order Deleted"
        });
    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
};