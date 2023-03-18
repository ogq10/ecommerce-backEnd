const express = require("express");
const app = express();
const cors = require("cors");

const dotenv = require("dotenv");
const path = require("path")
const userRoute = require("./routes/user");
const authRoute = require("./routes/auth");
const productRoute = require("./routes/product");
const stripeRoute = require("./routes/stripe");
const orderRoute = require("./routes/order");
const mongoose = require("mongoose");
dotenv.config();


app.use(cors({
  origin: ["http://localhost:3000", "https://shimmering-jalebi-463d6d.netlify.app"]
}));

app.use(express.json());



const url = process.env.MONGODB_URI
mongoose
  .connect(url, {
    useUnifiedTopology: true,
    useNewUrlParser: true,

  })
  .then(() => console.log("DB connection success"))
  .catch((err) => {
    console.log("error connecting to db ", err);
  });



app.use('/', require('./routes/root'))
app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/products", productRoute);
app.use("/api/stripe", stripeRoute);
app.use("/api/orders", orderRoute);


app.listen(process.env.PORT || 5000, () => {
  console.log("Backend server running");
});
