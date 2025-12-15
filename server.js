const express = require("express");
const User = require("./models/userSchema");
const path = require("path");
const homeRouter = require("./routes/homeRoute");
const authRoutes = require("./routes/authRoutes");
const dbConnection = require("./utils/dbConnection");
const jwtAuth = require("./middleware/jwtAuth");
const session = require("express-session");
const { MongoStore } = require("connect-mongo");
const cookieParser = require("cookie-parser");

require("dotenv").config();
const PORT = process.env.PORT || 3000;

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

/* ================= SESSION (DISABLED) ================= */
// app.use(session({
//   secret: process.env.SESSION_SECRET,
//   resave: false,
//   saveUninitialized: false,
//   cookie: { secure: false },
//   store: new MongoStore({
//     mongoUrl: process.env.DB_URI,
//     collection: 'sessions'
//   }),
// }));
/* ===================================================== */

app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

dbConnection(process.env.DB_URI);

app.use("/home", homeRouter);
app.use("/", authRoutes);

// Profile route (JWT)
app.get("/profile", jwtAuth, async (req, res) => {
  const user = await User.findById(req.user.userId);
  if (!user) return res.redirect("/login");

  res.render("profile", { user });
});

// Logout (JWT)
app.post("/logout", (req, res) => {
  // SESSION logout (disabled)
  // req.session.destroy(() => res.redirect("/login"));

  res.clearCookie("token");
  res.redirect("/login");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
