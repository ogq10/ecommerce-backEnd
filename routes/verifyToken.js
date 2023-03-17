const jwt = require("jsonwebtoken");
const User = require("../models/User");

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.token;
  console.log("token", authHeader)


  try {
    if (authHeader) {
      const token = authHeader.split(" ")[1];
      console.log("the token", token)
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      console.log("decoded >>>", decoded._id)
      req.user = await User.findById(decoded._id)
      console.log(req.user)
      next();
      return req.user;
    }

  } catch (error) {
    res.status(403).send(error)
    console.log(error)
  }

};

const verifyLink = (req, res, next) => {
  const authHeader = req.headers.token;
  if (authHeader) {
    const token = authHeader.split(".")[1];
    console.log("SPLIT TOKEN", token);
    jwt.verify(token, process.env.JWT_SECRET, (error, user) => {
      if (error) {
        res.status(403).send({ msg: "Token is not valid" });
        return;
      } else {
        req.user = user;
        next();
        return;
      }
    });
  } else {
    return res.status(401).send({ msg: "You are not authenticated." });
  }
};

const verifyTokenAndAuth = (req, res, next) => {

  console.log("the step")
  verifyToken(req, res, () => {

    if (req.user._id || req.user._id === req.body._id) {
      next();
      return;
    } else {
      res.status(403).send({ msg: "Invalid permission." });
      return;
    }
  });
};

//for creating ORDERS only admin can do that
const verifyTokenAndAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.isAdmin) {
      next();
      return;
    } else {
      res.status(403).send({ msg: "You are not admin. Can't create orders" });
      return;
    }
  });
};

module.exports = {
  verifyToken,
  verifyLink,
  verifyTokenAndAuth,
  verifyTokenAndAdmin,
};
