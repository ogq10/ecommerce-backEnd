const router = require("express").Router();

const stripe = require("stripe")(
  "sk_test_51L2tU3GMNEcDYYZgH5qcJLdgNlj3jpCbkxtBJlK5BqNVMnAJPa8HZhCetw695nRNf7KbkOueY4u3IQqbCwA9YMSK00T7yeiHTF"
);

router.post("/create-payment-intent", async (req, res) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: req.body.amount,
      currency: "usd",
      name: req.body.name,
      phone: req.body.phone,
      email: req.body.email,
      
    });
    res.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.log("failed")
  }
});

router.get("/payment_methods/:pid", async (req, res) => {
  console.log("the params", req.params.pid);
  const paymentMethod = await stripe.paymentMethods.retrieve(req.params.pid);

  res.json({
    paymentMethodData: paymentMethod,
  });
});
module.exports = router;
