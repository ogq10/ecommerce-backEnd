const Product = require("../models/Product");
const { verifyTokenAndAdmin } = require("./verifyToken");
const router = require("express").Router();

//Create product

router.post("/", async (req, res) => {
  const newProduct = new Product(req.body);

  try {
    const savedProduct = await newProduct.save();
    res.status(201).json({ savedProduct });
  } catch (err) {
    res.status(200).send(err.toString());
  }
});

//Update a product
router.patch("/:id", async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,

      { $set: req.body } 
     
    );
    res.status(200).json(updatedProduct);
  } catch (err) {
    res.status(404).json("Could not update product", err.toString());
  }
});

//Delete a product
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json("Product" + req.params.id + " has been deleted");
  } catch (err) {
    res.status(401).json("Could not delete product", err);
  }
});

//Get Specific Product
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.status(200).json(product);
  } catch (err) {
    res.status(401).json(`Could not find ${req.params.id} product`, err);
  }
});

//Get All Products
router.get("/", async (req, res) => {
  const newQuery = req.query.new;
  const newDrop = req.query.drop;
  const newFilter = req.query.filter;

  try {
    let products;

    if (newQuery) {
      products = await Product.find().sort({ createdAt: -1 }).limit(220);
    } else if (newDrop) {
      products = await Product.find({
        drop: {
          $in: [newDrop],
        },
      });
    } else if (newFilter) {
      products = await Product.find({
        filter: {
          $in: [newFilter],
        },
      });
    } else {
      products = await Product.find();
    }
    res.status(200).json(products);
  } catch (err) {
    res.status(401).json("Could not get products", err);
  }
});

module.exports = router;
