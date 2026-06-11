const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret', {
    expiresIn: '30d',
  });
};

// @route   POST /api/auth/signup
// @desc    Register a new user
router.post('/signup', async (req, res) => {
  const { email, password, role } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({ email, password, role, status: 'active' });

    if (user) {
      res.status(201).json({
        _id: user._id,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    }
  } catch (err) {
    console.error('Signup Error:', err);
    let message = 'Signup failed';
    if (err.code === 11000) {
      message = 'User already exists with this email';
    } else if (err.errors) {
      message = Object.values(err.errors).map(e => e.message).join(', ');
    } else {
      message = err.message;
    }
    res.status(400).json({ message });
  }
});

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  console.log(`Login attempt: ${email}`);

  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      console.log(`Login successful: ${email}`);
      res.json({
        _id: user._id,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      console.log(`Login failed: ${email} - Invalid credentials`);
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (err) {
    console.error('Login Error:', err);
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
