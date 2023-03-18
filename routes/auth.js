const router = require("express").Router();

const Joi = require("joi");

const User = require("../models/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const getAuthToken = require("../utils/genAuthToken");
const { joiPasswordExtendCore } = require("joi-password");
const joiPassword = Joi.extend(joiPasswordExtendCore);
var nodemailer = require("nodemailer");
const Guest = require("../models/Guest");
const { verifyTokenAndAdmin } = require("./verifyToken");

//FOROGOT PASSWORD

router.post("/forgot-password", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(400).send("User does not exist. Try again.");
    }

    const token = getAuthToken(user);
    res.status(201).send(token);

    console.log("the token>>>>>>>>", token);

    const link = `https://main--shimmering-jalebi-463d6d.netlify.app/reset-password/?id=${user._id}&token=${token}`;
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL,
        pass: process.env.GMAIL_PASS,
      },
    });

    var mailOptions = {
      from: "admin@makadsa.com",
      to: email,
      subject: "Password Reset Link | Makadsa ",
      text: link,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
    console.log(link);
  } catch (error) {}
});

//FORGOT PASSWORD VERIFY LINK SENT IN
router.get("/reset-password/:id/:token", async (req, res) => {
  const { id, token } = req.params;

  const user = await User.findOne({ _id: id });

  if (!user) {
    return res.json({ status: "User doesn't exist. Try again." });
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET);

    return res.status(201).send({ status: "Verified.", success: true });
  } catch (error) {
    return res.status(400).send({ status: "Not Verified.", success: false });
  }
});

//FORGOT PASSWORD NOW UPDATE USER PASSWORD

router.post("/reset-password/:id/:token", async (req, res) => {
  const { id, token } = req.params;

  const schema = Joi.object({
    password: joiPassword
      .string()
      .minOfSpecialCharacters(1)
      .minOfUppercase(1)
      .minOfNumeric(1)
      .noWhiteSpaces()
      .messages({
        "password.minOfUppercase":
          "Password should contain at least {#min} uppercase character",
        "password.minOfSpecialCharacters":
          "Password should contain at least {#min} special character",

        "password.minOfNumeric":
          "Password should contain at least {#min} numeric character",
        "password.noWhiteSpaces": "Password should not contain white spaces",
      }),
    confirmPassword: Joi.any()
      .equal(Joi.ref("password"))
      .required()
      .label("confirmPassword")

      .messages({
        "string.empty": `Please confirm your password`,
        "any.only": "Passwords do not match, try again.",
      }),
  });
  const { error } = schema.validate(req.body, { abortEarly: false });

  if (error) return res.status(400).send(error.details[0].message);

  const user = await User.findOne({ _id: id });
  if (!user) {
    return res.status(400).json({ status: "User does not exist. Try again." });
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET);

    await User.updateOne(
      {
        _id: id,
      },
      {
        $set: {
          password: CryptoJS.AES.encrypt(
            req.body.password,
            process.env.PASS_SECRET
          ).toString(),
        },
      }
    );
    res
      .status(201)
      .json({ updated: true, status: "Password has been updated!" });
  } catch (error) {
    res.status(400).json({
      updated: false,
      status: "An error occured updating your password. Try again.",
    });
  }
});

//REGISTER GUEST

router.post("/registerGuest", async (req, res) => {
  const schema = Joi.object({
    email: Joi.string()
      .email({
        minDomainSegments: 2,
        tlds: { allow: ["com", "net", "co", "info", "org"] },
      })
      .required()
      .messages({
        "string.empty": `Please enter your email`,
      }),
  });

  const { error } = schema.validate(req.body, { abortEarly: false });

  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  // let guestUser = await Guest.findOne({ email: req.body.email });
  if (user) return res.status(400).send("There is an account with this email.");

  if (!user) {
    let guestUser = await Guest.findOne({ email: req.body.email });
    if (guestUser) {
      const token = getAuthToken(guestUser);
      res.status(201).send(token);
    } else {
      user = new Guest({ email: req.body.email });
      user = await user.save();
    }
  }
});

//REGISTER
router.post("/register", async (req, res) => {
  const schema = Joi.object({
    fullName: Joi.string().lowercase().required().messages({
      "string.empty": `Please enter your full name`,
    }),
    email: Joi.string()
      .email({
        minDomainSegments: 2,
        tlds: { allow: ["com", "net", "co", "info", "org"] },
      })
      .required()
      .messages({
        "string.empty": `Please enter your email`,
      }),
    password: joiPassword
      .string()
      .minOfSpecialCharacters(1)
      .minOfUppercase(1)
      .minOfNumeric(1)
      .noWhiteSpaces()
      .messages({
        "password.minOfUppercase":
          "Password should contain at least {#min} uppercase character",
        "password.minOfSpecialCharacters":
          "Password should contain at least {#min} special character",

        "password.minOfNumeric":
          "Password should contain at least {#min} numeric character",
        "password.noWhiteSpaces": "Password should not contain white spaces",
      }),
    confirmPassword: Joi.any()
      .equal(Joi.ref("password"))
      .required()
      .label("confirmPassword")

      .messages({
        "string.empty": `Please confirm your password`,
        "any.only": "Passwords do not match, try again.",
      }),
  });

  const { error } = schema.validate(req.body, { abortEarly: false });

  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });

  if (user) return res.status(400).send("User already exists");

  user = new User({
    fullName: req.body.fullName,
    email: req.body.email,
    password: CryptoJS.AES.encrypt(
      req.body.password,
      process.env.PASS_SECRET
    ).toString(),
  });
  user = await user.save();
  const token = getAuthToken(user);
  res.send(token);

  // try {
  //   const customer = await createStripeCustomer({
  //     fullName: req.body.fullName,
  //     email: req.body.email,
  //   });

  //   console.log("the customer >>>", customer);
  //   // res.status(201).send(customer);

  //   res.status(201).json({ message: "Customer has been created" });
  // } catch (error) {
  //   res.status(400).json({ message: error.message });
  //   console.log(error);
  // }
});

//send the above to the DB

//LOGIN

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      res.status(503).send("Invalid email or password. Please try again.");
      return;
    }

    const hashedPassword = CryptoJS.AES.decrypt(
      user.password,
      process.env.PASS_SECRET
    );
    const OriginalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);

    if (OriginalPassword !== req.body.password) {
      res.status(503).send("Incorrect email or password. Please try again.");
      return;
    } else {
      const token = getAuthToken(user);
      res.status(201).send(token);
    }
  } catch (error) {
    res.status(503).send("Invalid email or password. Please try again.");
    return;
  }
});

router.post("/login/admin", verifyTokenAndAdmin, async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      res.status(503).send("Invalid email or password. Please try again.");
      return;
    }

    const hashedPassword = CryptoJS.AES.decrypt(
      user.password,
      process.env.PASS_SECRET
    );
    const OriginalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);

    if (OriginalPassword !== req.body.password) {
      res.status(503).send("Incorrect email or password. Please try again.");
      return;
    } else {
      const token = getAuthToken(user);
      res.status(201).send(token);
    }
  } catch (error) {
    res.status(503).send("You are not admin.");
    return;
  }
});

module.exports = router;
