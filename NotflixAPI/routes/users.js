const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const router = express.Router();
const passport = require('passport');
require('../auth/passport');



// Middleware to authenticate requests

function auth(req, res, next) {
    // const token = req.header('Authorization').replace('Bearer ', '');
    const token = req.cookies.token;
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
  console.log('Registration request received with body:', req.body);
  try {
      let user = await User.findOne({ email: req.body.email });
      console.log('User lookup result:', user);
      if (user) {
          console.log('User already registered with email:', req.body.email);
          // Change the status code to 409 which stands for conflict to indicate the email is already in use
          return res.status(409).json({ message: 'Email is already in use. Try another email' });
      }

      const userData = {
          email: req.body.email,
          password: req.body.password,
          plan: req.body.plan,
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          birthday: req.body.birthday,
          phone: req.body.phone
      };

      console.log('Creating new user with data:', userData);
      user = new User(userData);
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
      await user.save();
      console.log('User created successfully:', user);

      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      console.log('Generated Token:', token);

      res.cookie('token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 3600000
      });

      res.status(201).json({
          message: "User created successfully",
          user: {
              _id: user._id,
              email: user.email,
              plan: user.plan,
          }
      });
  } catch (error) {
      console.error('Error during registration:', error);
      res.status(500).json({ message: error.message });
  }
});



// User login
router.post('/login', async (req, res) => {
  console.log('[Login] Request received with email:', req.body.email);

  try {
    console.log('[Login] Finding user in the database');
    const { email, password } = req.body;

    let user = await User.findOne({ email });
    console.log('[Login] User search result:', user ? `User found with email ${email}` : `No user found with email ${email}`);

    if (!user) {
      console.log('[Login] No user found for email:', email);
      return res.status(400).send('Invalid email or password.');
    }

    console.log('[Login] User found, checking password validity');
    const validPassword = await bcrypt.compare(password, user.password);
    console.log('[Login] Password validation result:', validPassword ? 'Password is valid' : 'Password is invalid');

    if (!validPassword) {
      console.log('[Login] Invalid password for email:', email);
      return res.status(400).send('Invalid email or password.');
    }

    console.log('[Login] Password valid, generating JWT token');
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' }); // Token expires in 1 hour
    console.log('[Login] JWT token generated successfully');

    console.log('[Login] Setting token in httpOnly cookie');
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Use secure in production
      sameSite: 'strict', // Helps protect against CSRF
      maxAge: 3600000
    });

    console.log('[Login] Login successful, sending response');
    res.json({ message: 'Login successful' });
    console.log('[Login] Response sent successfully');
  } catch (error) {
    console.error('[Login] Error occurred:', error);
    res.status(500).send('An error occurred during login.');
  }
});


router.put('/user/update', auth, async (req, res) => {
  try {
      console.log('Update request received for user ID:', req.user._id);
      const userId = req.user._id;
      const updates = req.body;
      console.log('Requested updates:', updates);

      let user = await User.findById(userId);
      console.log('User found:', user);
      if (!user) {
          console.log('No user found with ID:', userId);
          return res.status(404).json({ message: 'User not found.' });
      }

      const allowedUpdates = ['firstName', 'lastName', 'birthday', 'phone', 'plan'];
      console.log('Allowed updates:', allowedUpdates);
      const actualUpdates = Object.keys(updates).filter(key => allowedUpdates.includes(key));
      console.log('Actual updates:', actualUpdates);

      actualUpdates.forEach((key) => {
          user[key] = updates[key];
      });

      await user.save();
      console.log('User updated successfully:', user);
      res.json({ message: 'User updated successfully', user });
  } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});




    // res.header('x-auth-token', token).send({ message: 'Login successful', token });


//Update user information
// router.put('/user/update', auth, async (req, res) => {
//   try {
//     // req.user is set by the auth middleware
//     const userId = req.user._id;
//     const updates = req.body;

//     // to  Validate the updates against the schema

//     let user = await User.findById(userId);
//     if (!user) return res.status(404).send('User not found.');

//     //  to Update fields
//     if (updates.email) user.email = updates.email;
//     if (updates.plan) user.plan = updates.plan;
//     // Save the updated user
//     await user.save();

//     //  to Generate a new token
//     // const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

//     //  to Respond with the new token
//     // res.header('x-auth-token', token).send({ message: 'User updated successfully', token });
//   //   res.cookie('token', token, {
//   //     httpOnly: true,
//   //     secure: process.env.NODE_ENV === 'production',
//   //     sameSite: 'strict',
//   //     maxAge: 3600000
//   // });
//   res.json({ message: 'User updated successfully' });

//   } catch (error) {
//     res.status(500).send(error.message);
//   }
// });

// Update user plan
// Update user plan
router.patch('/users/:userId/plan', auth, async (req, res) => {
  const { userId } = req.params;
  const { plan } = req.body;

  console.log(`Plan update request received. User ID: ${userId}, Plan: ${plan}`);

  if (!userId) {
      console.error('User ID is not provided in the request parameters.');
      return res.status(400).json({ message: 'User ID is missing' });
  }

  if (!plan) {
      console.error('Plan is not provided in the request body.');
      return res.status(400).json({ message: 'Plan is missing' });
  }

  try {
      console.log(`Attempting to find user with ID: ${userId}`);
      const user = await User.findById(userId);

      if (!user) {
          console.log(`No user found with ID: ${userId}`);
          return res.status(404).json({ message: 'User not found.' });
      }

      console.log(`User found: ${user.email}, Current plan: ${user.plan}`);
      console.log(`Updating user's plan to: ${plan}`);
      user.plan = plan;

      const savedUser = await user.save();
      console.log(`User plan updated successfully. User ID: ${userId}, New Plan: ${savedUser.plan}`);

      res.json({ message: 'Plan updated successfully', user: { _id: savedUser._id, plan: savedUser.plan } });
  } catch (error) {
      console.error(`Error updating plan for user ID: ${userId}: ${error}`);
      res.status(500).json({ message: 'Internal Server Error', error: error.toString() });
  }
});



router.get('/users/me', auth, (req, res) => {
  if (req.user && req.user._id) {
    res.json({ userId: req.user._id });
  } else {
    res.status(403).json({ message: 'Not authenticated' });
  }
});

// Update user plan
router.put('/users/:userId/plan', auth, async (req, res) => {
  const { userId } = req.params;
  const { plan } = req.body;

  console.log(`Plan update request received. User ID: ${userId}, Plan: ${plan}`);

  if (!userId) {
    console.error('User ID is not provided in the request parameters.');
    return res.status(400).json({ message: 'User ID is missing' });
  }

  if (!plan) {
    console.error('Plan is not provided in the request body.');
    return res.status(400).json({ message: 'Plan is missing' });
  }

  try {
    console.log(`Attempting to find user with ID: ${userId}`);
    const user = await User.findById(userId);

    if (!user) {
      console.error(`No user found with ID: ${userId}`);
      return res.status(404).json({ message: 'User not found.' });
    }

    console.log(`User found: ${user.email}, Current plan: ${user.plan}`);
    console.log(`Updating user's plan to: ${plan}`);
    user.plan = plan;

    await user.save();
    console.log(`User plan updated successfully. User ID: ${userId}, New Plan: ${user.plan}`);

    res.json({ message: 'Plan updated successfully', user: { _id: user._id, plan: user.plan } });
  } catch (error) {
    console.error(`Error updating plan for user ID: ${userId}: ${error}`);
    res.status(500).json({ message: 'Internal Server Error', error: error.toString() });
  }
});




router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.send({ message: 'Logout successful' });
});



module.exports = router;
