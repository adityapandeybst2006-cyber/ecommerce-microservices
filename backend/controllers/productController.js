const Product = require("../models/Product");

// GET ALL PRODUCTS
exports.getProducts = async (req, res) => {
  try {
    const { category } = req.query;

    let products;

    if (category) {
      products = await Product.find({ category });
    } else {
      products = await Product.find();
    }

    res.json(products);

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
};

// GET SINGLE PRODUCT
exports.getProduct = async (req, res) => {

  try {

    const product = await Product.findById(req.params.id);

    if (!product) {

      return res.status(404).json({
        error: "Product not found"
      });

    }

    res.json(product);

  } catch (err) {

    res.status(500).json({
      error: err.message
    });

  }

};

// ADD PRODUCT
exports.addProduct = async (req, res) => {

  try {

    const product = await Product.create(req.body);

    res.status(201).json(product);

  } catch (err) {

    res.status(500).json({
      error: err.message
    });

  }

};

// UPDATE PRODUCT
exports.updateProduct = async (req, res) => {

  try {

    const product = await Product.findByIdAndUpdate(

      req.params.id,

      req.body,

      { new: true }

    );

    res.json(product);

  } catch (err) {

    res.status(500).json({
      error: err.message
    });

  }

};

// DELETE PRODUCT
exports.deleteProduct = async (req, res) => {

  try {

    await Product.findByIdAndDelete(req.params.id);

    res.json({
      message: "Product Deleted"
    });

  } catch (err) {

    res.status(500).json({
      error: err.message
    });

  }

};