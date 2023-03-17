const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var validateEmail = function (email) {
  var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(email);
};

const GuestSchema = new mongoose.Schema(
  {
    orders: [
      {
        type: Schema.Types.ObjectId,
        ref: "orders",
      },
    ],

    email: {
      type: String,
      required: [true, "Email address is required."],
      unique: true,
      validate: [validateEmail, "Please enter a valid email address"],
      minlength: 3,
      maxlength: 200,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please fill a valid email address",
      ],
    },

    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Guest", GuestSchema);
