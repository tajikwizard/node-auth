const { verifyToken } = require("../utils/jwtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.cookies?.token;
    console.log(token)
    if (!token) return res.redirect("/login");

    const decoded = verifyToken(token);
    req.user = decoded; // { userId }

    next();
  } catch (err) {
    return res.redirect("/login");
  }
};
