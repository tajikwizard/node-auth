const User = require("../models/userSchema");
const { hashPassword, verifyPassword } = require("../utils/passwordHash");
const { generateToken } = require("../utils/jwtoken");

// Register a new user
exports.registerUser = async (req, res) => {
  try {
    const { fullname, username, password } = req.body;

    const existingUser = await User.findOne({ username });
    if (existingUser) return res.send("Username already taken");

    const hashedPassword = await hashPassword(password);

    const user = new User({ fullname, username, password: hashedPassword });
    await user.save();

    // SESSION (disabled)
    // req.session.username = user.username;

    // JWT (optional: auto-login after register)
    const token = generateToken({ userId: user._id });

    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // true in production
      sameSite: "strict",
    });

    res.redirect("/profile");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

// Login user
exports.loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) return res.send("Invalid credentials");

    const isValid = await verifyPassword(password, user.password);
    if (!isValid) return res.send("Invalid credentials");

    // SESSION (disabled)
    // req.session.username = user.username;

    // JWT
    const token = generateToken({ userId: user._id });

    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // true in production
      sameSite: "strict",
    });

    res.redirect("/profile");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};
