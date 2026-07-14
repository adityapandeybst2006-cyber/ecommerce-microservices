const mongoose = require("mongoose");


const addressSchema = new mongoose.Schema(
  {
    street: {
      type: String,
      default: ""
    },
    city: {
      type: String,
      default: ""
    },
    state: {
      type: String,
      default: ""
    },
    pincode: {
      type: String,
      default: ""
    }
  },
  { _id: false } 
);

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },
    password: {
      type: String,
      required: true
    },
    
    phone: {
      type: String,
      default: ""
    },
    
    address: {
      type: addressSchema,
      default: () => ({}) 
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("User", userSchema);