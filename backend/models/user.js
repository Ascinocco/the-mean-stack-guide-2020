const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true, // cannot rely on this for uniqueness, just helps with performance
  },
  password: {
    type: String,
    required: true,
  },
});

// ensures email is unique
userSchema.plugin(uniqueValidator)

module.exports = mongoose.model('User', userSchema);
