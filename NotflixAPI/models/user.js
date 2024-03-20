const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  plan: {
    type: String,
    required: true, // Make it optional since not all users might select a plan upon registration
  },

});

const User = mongoose.model('User', userSchema);

module.exports = User;
