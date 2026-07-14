const mongoose = require("mongoose");


const shippingAddressSchema = new mongoose.Schema(
  {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    phone: { type: String, required: true } 
  },
  { _id: false }
);

const orderItemSchema = new mongoose.Schema(
  {
    id: {
      type: String,  
      required: true
    },
    name: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    qty: {
      type: Number,
      required: true
    },
    image: {
      type: String,
      default: ""
    }
  },
  {
    _id: false   
  }
);

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true
    },

    items: {
      type: [orderItemSchema],
      required: true
    },

    total: {
      type: Number,
      required: true
    },

    
    shippingAddress: {
      type: shippingAddressSchema,
      required: true
    },

   
    paymentMethod: {
      type: String,
      enum: ["COD", "UPI", "Card"],
      default: "COD",
      required: true
    },

    
    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed"],
      default: "Pending"
    },

    status: {
      type: String,
      enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
      default: "Pending"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Order", orderSchema);