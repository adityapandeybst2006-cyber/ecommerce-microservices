const Order = require("../models/Order");

// Mock Payment Gateway
exports.chargePayment = async (req, res) => {

    try {

        const { orderId, amount } = req.body;

        if (!orderId || !amount) {
            return res.status(400).json({
                error: "Order ID and Amount are required"
            });
        }

        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({
                error: "Order not found"
            });
        }

        // Mock Payment Success
        order.status = "Paid";

        await order.save();

        res.json({
            success: true,
            paymentId: "PAY_" + Date.now(),
            orderId: order._id,
            amount,
            status: order.status,
            message: "Payment Successful"
        });

    } catch (err) {

        res.status(500).json({
            error: err.message
        });

    }

};