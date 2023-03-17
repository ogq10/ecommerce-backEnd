const express = require("express");
const app = express();
const cors = require("cors");
 
const dotenv = require("dotenv");

const userRoute = require("./routes/user");
const authRoute = require("./routes/auth");
const productRoute = require("./routes/product");
const stripeRoute = require("./routes/stripe");
const orderRoute = require("./routes/order");

const path = require("path");

if (process.env.NODE_ENV === "production") {
    app.use(
        express.static(
            path.join(__dirname, "../client/build")
        )
    );
    app.get("*", (req, res) => {
        res.sendFile(
            path.resolve(
                __dirname,
                "..",
                "client",
                "build",
                "index.html"
            )
        );
    });
} else {
    app.get("/", (req, res) => {
        res.send("API started...");
    });
}
const mongoose = require("mongoose");
app.use(cors())

app.use(express.json());

dotenv.config();

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("DB connection success"))
  .catch((err) => {
    console.log("error connecting to db ", err);
  });


app.use(express.static(path.join(__dirname, "/client/build")));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/client/build', 'index.html'));
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
