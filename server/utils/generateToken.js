const jwt = require("jsonwebtoken");

const generateToken = (user) => {
  const token = jwt.sign({ id: user._id, username: user.username }, "teju188", {
    expiresIn: "1h",
  });

  const refreshToken = jwt.sign(
    { id: user._id, username: user.username },
    "teju758",
    { expiresIn: "1h" }
  );

  return { token, refreshToken };
};

module.exports = generateToken;
