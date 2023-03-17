const jwt = require("jsonwebtoken");

const getAuthToken = (user) => {
  const accessToken = jwt.sign(
    {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      isAdmin: user.isAdmin,
    },
    process.env.JWT_SECRET,
    { expiresIn: "3d" }
  );
  return accessToken;
};

 

module.exports = getAuthToken;
