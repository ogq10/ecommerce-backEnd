const router = require("express").Router();
const { Order } = require("../models/orders");
const User = require("../models/User");
const Guest = require("../models/Guest");

const {
  verifyToken,
  verifyTokenAndAdmin,
  verifyTokenAndAuth,
} = require("./verifyToken");
//Create product

router.get("/", async (req, res) => {
  try {
    const orders = await Order.find({}).sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.send({ message: error.message });
  }
});


router.post("/guest", async (req, res) => {
  const { order } = req.body;

  try {
    if (order.order.userInfo.email === "") {
      console.log("User info is incomplete");
    }

    if (order.order.cartItems && order.order.cartItems.length === 0) {
      console.log("No order items found. ");
    }

    if (
      order.order.shippingAddress.line1 === "" ||
      order.order.shippingAddress.postal_code === "" ||
      order.order.shippingAddress.postal_code === "" ||
      order.order.shippingAddress.state === "" ||
      order.order.shippingAddress.city === "" ||
      order.order.shippingAddress.country === ""
    ) {
      console.log("No shipping address found. ");
    }

    const newOrder = new Order(order);

    const createdOrder = await Order.create(newOrder);

    const foundUser = await Guest.findById(order.order.userInfo._id);

    //add order to found user

    foundUser.orders = foundUser.orders.concat(createdOrder._id);

    await foundUser.save();

    res.status(201).send(createdOrder);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

router.post("/", async (req, res) => {
  const { order } = req.body;

  try {
    if (order.order.userInfo.email === "") {
      console.log("User info is incomplete");
    }

    if (order.order.cartItems && order.order.cartItems.length === 0) {
      console.log("No order items found. ");
    }

    if (
      order.order.shippingAddress.line1 === "" ||
      order.order.shippingAddress.postal_code === "" ||
      order.order.shippingAddress.postal_code === "" ||
      order.order.shippingAddress.state === "" ||
      order.order.shippingAddress.city === "" ||
      order.order.shippingAddress.country === ""
    ) {
      console.log("No shipping address found. ");
    }

    const newOrder = new Order(order);

    console.log("the new order >>>>", newOrder);

    const createdOrder = await Order.create(newOrder);


    console.log("THE CREATED ORDER >>>", createdOrder)

    const foundUser = await User.findById(order.user);

    console.log("THE FOUNDED USER >>> ", foundUser)
    //add order to found user

    foundUser.orders = foundUser.orders.concat(createdOrder._id);

    await foundUser.save();

    res.status(201).send(createdOrder);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    res.status(201).send(order);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

router.patch("/:id/deliver", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    order.isDelivered = !order.isDelivered;

    order.deliveredAt = Date.now();

    const updatedOrder = await order.save();

    res.status(201).send(updatedOrder);
    console.log("UPDATED ORDER >>>>>>>>> ", updatedOrder)
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});



module.exports = router;
