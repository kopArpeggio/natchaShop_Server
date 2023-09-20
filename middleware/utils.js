const jwt = require("jsonwebtoken");

exports.createToken = (userId, username) => {
  return jwt.sign(
    {
      id: userId,
      username: username,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7 days" }
  );
};
