const { Order } = require("../models/orders");
const CryptoJS = require("crypto-js");

const User = require("../models/User");
const {
  verifyToken,
  verifyTokenAndAuth,
  verifyTokenAndAdmin,
} = require("./verifyToken");

const router = require("express").Router();

//Update user

// router.put("/:id", verifyTokenAndAuth, async (req, res) => {
//   //decide whether token belongs to client or admin etc
//   if (req.body.password) {
//     console.log("working")
//     req.body.password = CryptoJS.AES.encrypt(
//       req.body.password,
//       process.env.PASS_SECRET
//     ).toString();
//   }

//   try {
//     const updatedUser = await User.findByIdAndUpdate(
//       req.user._id,
//       {
//         $set: req.body,
//       },
//       { new: true }
//     );
//     res.status(200).json(updatedUser);
//     return;
//   } catch (error) {
//     res.status(500).json(error);
//     return;
//   }
// });

//update profile info 

router.put("/profile", verifyTokenAndAuth, async (req, res) => {
  //decide whether token belongs to client or admin etc

  if (req.body.password !== "") {
    req.body.password = CryptoJS.AES.encrypt(
      req.body.password,
      process.env.PASS_SECRET
    ).toString();
  }

  console.log("the user>>>> ", req.user._id)
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(user);
    return;

  } catch (error) {
    res.status(500).json(error);

  }

});

//Delete user
router.delete("/:id", verifyTokenAndAuth, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json("User has been deleted");
    return;
  } catch (error) {
    res.status(500).json("Can't delete user");
    return;
  }
});

//Get user (only admin)
router.get("/find/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { password, ...others } = user._doc;
    res.status(200).json(others);
  } catch (error) {
    res.status(500).json("User not found. User info is wrong.");
    return;
  }
});

//Get All Users (only admin)
// router.get("/", verifyTokenAndAdmin, async (req, res) => {
//   const query = req.query.new;
//   try {
//     const users = query
//       ? await User.find().sort({ _id: -1 }).limit(5)
//       : await User.find();
//     res.status(200).json(users);
//   } catch (error) {
//     if (!query) {
//       res.status(500).json("Something went wrong. Can't retrieve top 5 users.");
//       return;
//     } else {
//       res.status(500).json("Something went wrong. Can't retrieve all users.");
//       return;
//     }
//   }
// });

router.get("/:id/orders", async (req, res) => {
  const userId = req.params.id;

  try {
    const orders = await Order.find({ user: userId })
      .limit(10)
      .sort({ createdAt: -1 });
    console.log(userId);

    res.json(orders);
  } catch (error) {
    res.send({ message: error.message });
  }
});

router.get("/", verifyTokenAndAdmin, async (req, res) => {
  try {
    const users = await User.find({}).sort({ createdAt: -1 });

    res.json(users);
  } catch (error) {
    res.send({ message: error.message });
  }
});

module.exports = router;
