/* Author: Xinyi */
const mongoose = require('mongoose');

/**
 * User is the account/identity entity. One document per registered
 * account. It backs both authentication (email + hashed password) and
 * authorization (the role field drives requireAdmin).
 */
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    // unique + lowercase together prevent duplicate accounts that
    // differ only by case (e.g. "A@x.com" vs "a@x.com"); login always
    // looks the email up lowercased to match.
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    // Stores the bcrypt HASH only — the plaintext password is never
    // persisted. Hashing happens in routes/auth.js before create.
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  role: {
    // Enum-constrained so an unexpected value can't silently grant
    // access. Defaults to the least-privileged role; admins are created
    // via seed.js or promoted through the admin routes.
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema);
