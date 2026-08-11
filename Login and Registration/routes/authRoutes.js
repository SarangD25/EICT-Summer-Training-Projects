const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const User = require("../models/User");
const { protect } = require("../middleware/auth");

// helper function to create jwt token
function generateToken(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
}

// ============ PAGE ROUTES ============

// home page - redirect to login
router.get("/", (req, res) => {
  res.redirect("/login");
});

// show register page
router.get("/register", (req, res) => {
  res.render("register", { error: null });
});

// show login page
router.get("/login", (req, res) => {
  res.render("login", { error: null, success: null });
});

// show forgot password page
router.get("/forgot-password", (req, res) => {
  res.render("forgot-password", { error: null, success: null });
});

// show reset password page (with token)
router.get("/reset-password/:token", (req, res) => {
  res.render("reset-password", { error: null, token: req.params.token });
});

// dashboard - protected route
router.get("/dashboard", protect, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return res.redirect("/login");
    }
    res.render("dashboard", { user });
  } catch (err) {
    console.log(err);
    res.redirect("/login");
  }
});

// ============ AUTH ROUTES ============

// POST - Register new user
router.post("/register", async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;

  // basic validation
  if (!name || !email || !password || !confirmPassword) {
    return res.render("register", { error: "Please fill in all fields" });
  }

  if (password.length < 6) {
    return res.render("register", {
      error: "Password must be at least 6 characters",
    });
  }

  if (password !== confirmPassword) {
    return res.render("register", { error: "Passwords do not match" });
  }

  // simple email check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.render("register", { error: "Please enter a valid email" });
  }

  try {
    // check if user already exists
    let existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res.render("register", {
        error: "An account with this email already exists",
      });
    }

    // create user
    const user = await User.create({ name, email, password });

    // create token and set cookie
    const token = generateToken(user._id);
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    res.redirect("/dashboard");
  } catch (err) {
    console.log(err);
    res.render("register", { error: "Something went wrong, please try again" });
  }
});

// POST - Login user
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.render("login", {
      error: "Please enter email and password",
      success: null,
    });
  }

  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.render("login", {
        error: "Invalid email or password",
        success: null,
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.render("login", {
        error: "Invalid email or password",
        success: null,
      });
    }

    // create token and set cookie
    const token = generateToken(user._id);
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.redirect("/dashboard");
  } catch (err) {
    console.log(err);
    res.render("login", {
      error: "Something went wrong",
      success: null,
    });
  }
});

// GET - Logout
router.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.redirect("/login");
});

// POST - Forgot password
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.render("forgot-password", {
      error: "Please enter your email",
      success: null,
    });
  }

  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      // dont reveal if user exists or not (security)
      return res.render("forgot-password", {
        error: null,
        success: "If an account exists with this email, a reset link has been sent.",
      });
    }

    // generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetToken = resetToken;
    user.resetTokenExpiry = Date.now() + 3600000; // 1 hour
    await user.save();

    // send email
    const resetUrl = `http://localhost:${process.env.PORT}/reset-password/${resetToken}`;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Password Reset Request",
      html: `
        <h2>Password Reset</h2>
        <p>Hi ${user.name},</p>
        <p>You requested a password reset. Click the link below to reset your password:</p>
        <a href="${resetUrl}">${resetUrl}</a>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request this, just ignore this email.</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.render("forgot-password", {
      error: null,
      success: "If an account exists with this email, a reset link has been sent.",
    });
  } catch (err) {
    console.log(err);
    res.render("forgot-password", {
      error: "Something went wrong. Please try again later.",
      success: null,
    });
  }
});

// POST - Reset password
router.post("/reset-password/:token", async (req, res) => {
  const { password, confirmPassword } = req.body;
  const { token } = req.params;

  if (!password || !confirmPassword) {
    return res.render("reset-password", {
      error: "Please fill in all fields",
      token,
    });
  }

  if (password.length < 6) {
    return res.render("reset-password", {
      error: "Password must be at least 6 characters",
      token,
    });
  }

  if (password !== confirmPassword) {
    return res.render("reset-password", {
      error: "Passwords do not match",
      token,
    });
  }

  try {
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return res.render("reset-password", {
        error: "Invalid or expired reset token. Please request a new one.",
        token,
      });
    }

    user.password = password;
    user.resetToken = null;
    user.resetTokenExpiry = null;
    await user.save();

    res.render("login", {
      error: null,
      success: "Password has been reset successfully! You can now log in.",
    });
  } catch (err) {
    console.log(err);
    res.render("reset-password", {
      error: "Something went wrong",
      token,
    });
  }
});

module.exports = router;
