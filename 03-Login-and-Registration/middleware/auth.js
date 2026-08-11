const jwt = require("jsonwebtoken");

// middleware to check if user is logged in
const protect = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.redirect("/login");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    res.clearCookie("token");
    return res.redirect("/login");
  }
};

module.exports = { protect };
