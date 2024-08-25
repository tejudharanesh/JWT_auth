const User = require("../models/User");
const generateToken = require("../utils/generateToken");

exports.register = async (req, res) => {
  const { username, email, password } = req.body;

  console.log(username, email, password);

  try {
    const user = await User.create({ username, email, password });
    console.log(user);

    const tokens = generateToken(user);
    console.log(tokens);

    res.cookie("token", tokens.token, { httpOnly: true });
    res.cookie("refreshToken", tokens.refreshToken, { httpOnly: true });

    res.status(201).json({ user, token: tokens.token });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const tokens = generateToken(user);

    res.cookie("token", tokens.token, { httpOnly: true });
    res.cookie("refreshToken", tokens.refreshToken, { httpOnly: true });

    res.status(200).json({ user, token: tokens.token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.logout = (req, res) => {
  res.clearCookie("token");
  res.clearCookie("refreshToken");
  res.status(200).json({ message: "Logged out successfully" });
};

exports.refreshToken = (req, res) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken)
    return res.status(401).json({ message: "No refresh token provided" });

  try {
    const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const user = { id: payload.id, username: payload.username };

    const newTokens = generateToken(user);

    res.cookie("token", newTokens.token, { httpOnly: true });
    res.cookie("refreshToken", newTokens.refreshToken, { httpOnly: true });

    res.status(200).json({ token: newTokens.token });
  } catch (error) {
    res.status(403).json({ message: "Invalid refresh token" });
  }
};
