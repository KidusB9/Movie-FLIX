const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const router = express.Router();


// Middleware to authenticate requests

function auth(req, res, next) {
    const token = req.header('Authorization').replace('Bearer ', '');
    if (!token) return res.status(401).send('Access denied. No token provided.');

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (ex) {
        res.status(400).send('Invalid token.');
    }
}




// User registration
router.post('/register', async (req, res) => {
  console.log(req.body);
  try {
    // Check if user already exists
    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send('User already registered.');

    const userData = {
      email: req.body.email,
      password: req.body.password,
      plan: req.body.plan
    };

    user = new User(userData);
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    await user.save();

    
    res.status(201).send({
      message: "User created successfully",
      user: {
        email: user.email,
        _id: user._id,
        plan: user.plan //  in the future iterations we can Include the  user (purchase)plan in the response if needed
      }
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
});


// User login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    let user = await User.findOne({ email });
    if (!user) return res.status(400).send('Invalid email or password.');

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).send('Invalid email or password.');

    // Placeholder for JWT token generation
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' }); // Token expires in 1 hour
    res.header('x-auth-token', token).send({ message: 'Login successful', token });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Update user information
router.put('/user/update', auth, async (req, res) => {
  try {
    // req.user is set by the auth middleware
    const userId = req.user._id;
    const updates = req.body;

    // to  Validate the updates against the schema

    let user = await User.findById(userId);
    if (!user) return res.status(404).send('User not found.');

    //  to Update fields
    if (updates.email) user.email = updates.email;
    if (updates.plan) user.plan = updates.plan;
    // Save the updated user
    await user.save();

    //  to Generate a new token
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    //  to Respond with the new token
    res.header('x-auth-token', token).send({ message: 'User updated successfully', token });
  } catch (error) {
    res.status(500).send(error.message);
  }
});



module.exports = router;
