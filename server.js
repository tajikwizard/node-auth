const express = require("express");
const User = require("./models/userSchema");
const path = require("path");
const homeRouter = require("./routes/homeRoute");
const authRoutes = require("./routes/authRoutes");
const dbConnection = require("./utils/dbConnection");
const isAuthenticated = require("./middleware/authMiddleware");
const session = require('express-session');
const {MongoStore} = require('connect-mongo')
require('dotenv').config();
const PORT = process.env.PORT || 3000;
const app = express();
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));



app.use(session({
    secret: process.env.SESSION_SECRET,

    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
        store: new MongoStore({
        mongoUrl: process.env.DB_URI,
        collection: 'sessions'
    }),
}));


app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

dbConnection(process.env.DB_URI);

app.use("/home", homeRouter);
app.use("/", authRoutes);

// Profile route using session
app.get("/profile", async (req, res) => {
    if (!req.session.username) return res.redirect("/login");

    const user = await User.findOne({ username: req.session.username });
    if (!user) return res.redirect("/login");

    res.render("profile", { user });
});

// Logout route
app.post("/logout", (req, res) => {
    req.session.destroy(err => {
        if (err) return res.status(500).send("Logout failed");
        res.redirect("/login");
    });
});

app.get("/secret", isAuthenticated, (req,res)=>{
    res.render("secret");
})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
