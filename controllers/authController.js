const User = require("../models/userSchema");
const { hashPassword, verifyPassword } = require("../utils/passwordHash");

// Register a new user
exports.registerUser = async (req, res) => {
    try {
        const { fullname, username, password } = req.body;

        const existingUser = await User.findOne({ username });
        if (existingUser) return res.send("Username already taken");

        const hashedPassword = await hashPassword(password);

        const user = new User({ fullname, username, password: hashedPassword });
        await user.save();

        // Store username in session
        req.session.username = user.username;

        res.redirect("/profile");
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
};

// Login a user
exports.loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ username });
        if (!user) return res.send("Invalid credentials");

        const isValid = await verifyPassword(password, user.password);
        if (!isValid) return res.send("Invalid credentials");

        // Store username in session
        req.session.username = user.username;

        res.redirect("/profile");
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
};
