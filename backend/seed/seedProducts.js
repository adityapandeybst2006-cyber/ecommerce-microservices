const mongoose = require("mongoose");
require("dotenv").config();

const Product = require("../models/Product");

const products = [
  {
    name: "Cotton Printed Kurti",
    category: "Apparel",
    price: 1299,
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8"
  },
  {
    name: "Classic Cotton Shirt",
    category: "Apparel",
    price: 1499,
    image: "https://images.unsplash.com/photo-1605763240000-7e93b172d754"
  },
  {
    name: "Handwoven Jute Tote",
    category: "Accessories",
    price: 799,
    image: "https://images.unsplash.com/photo-1594223274512-ad4803739b7c"
  },
  {
    name: "Leather Wallet",
    category: "Accessories",
    price: 999,
    image: "https://images.unsplash.com/photo-1627123424574-724758594e93"
  },
  {
    name: "Scented Soy Candle",
    category: "Home",
    price: 499,
    image: "https://images.unsplash.com/photo-1603006905003-be475563bc59"
  },
  {
    name: "Wooden Table Lamp",
    category: "Home",
    price: 1899,
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85"
  }
];

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB Connected");

    await Product.deleteMany();

    console.log("Old Products Removed");

    await Product.insertMany(products);

    console.log("Products Inserted Successfully");

    process.exit();

  } catch (err) {

    console.log(err);

    process.exit(1);

  }
}

seedDatabase();