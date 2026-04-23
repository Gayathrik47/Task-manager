const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


// REGISTER
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // password validation
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{6,}$/.test(password)) {
      return res.status(400).send("Weak password");
    }

    // check existing user
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).send("User already exists");
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword
      // role will default to "user"
    });

    await user.save();

    res.send("User registered successfully");

  } catch (err) {
    console.log(err);
    res.status(500).send("Error");
  }
});


// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // check user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send("Invalid credentials");
    }

    // compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send("Invalid credentials");
    }

    // generate token WITH ROLE
    const token = jwt.sign(
  { id: user._id, role: user.role, name: user.name },
  "secret",
  { expiresIn: "1d" }
);
    // send role + name also
    res.json({
      token,
      name: user.name,
      role: user.role
    });

  } catch (err) {
    console.log(err);
    res.status(500).send("Error");
  }
});

module.exports = router;