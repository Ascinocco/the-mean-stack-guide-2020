const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

const router = express.Router();

router.post('/signup', (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then((hash) => {
      const user = new User({
        email: req.body.email,
        password: hash,
      });

      user.save()
        .then((result) => {
          res.status(201).json({
            message: 'User created',
          });
        })
        .catch((err) => {
          res.status(500).json({
            error: err,
          });
        });
    });
});

router.post('/login', (req, res, next) => {
  let userToLogin;
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res.status(401).json({
          message: 'Auth failed',
        });
      }
      userToLogin = user;
      return bcrypt.compare(req.body.password, user.password);
    })
    .then((result) => {
      if (!result || !userToLogin) {
        return res.status(401).json({
          message: 'Auth failed',
        });
      }

      const token = jwt.sign(
        {
        email: userToLogin.email,
        userId: userToLogin._id,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: '1h',
        },
      );

      return res.status(200).json({
        token,
        userId: userToLogin._id,
        expiresIn: 3600,
      });
    })
    .catch((err) => {
      console.log('err', err);
      return res.status(401).json({
        message: 'Auth failed',
        err,
      });
    });
});

module.exports = router;
