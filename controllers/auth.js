const bcrypt = require('bcryptjs');
const db = require('../models');

//POST Register
const register = (req, res) => {
  if (!req.body.name || !req.body.email || !req.body.password) {
    return res.status(400).json({ status: 400, message: 'Please enter your name, email and password' });
  }
  db.User.findOne({ email: req.body.email }, (err, foundUser) => {
    if (err) return res.status(500).json({ status: 500, message: 'Something went wrong, please try again'});

    if (foundUser) return res.status(400).json({ status: 400, message: 'This account has already been registered'});

    bcrypt.genSalt(10, (err, salt) => {
      if (err) return res.status(500).json({ status: 500, message: 'Something went wrong, please try again'});

      bcrypt.hash(req.body.password, salt, (err, hash) => {
        if (err) return res.status(500).json({ status: 500, message: 'Somthing went wrong, please try again'});

        const newUser = {
          name: req.body.name,
          email: req.body.email,
          password: hash,
        }

        db.User.create(newUser, (err, savedUser) => {
          if (err) return res.status(500).json({ status: 500, message: err});
          req.session.currentUser = { id: savedUser._id }
          res.status(201).json({ status: 201, data: savedUser });
        });
      });
    });
  });
};

//POST Login
const login = (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.status(400).json({ staus: 400, message: 'Please enter your email and password'});
  }

  db.User.findOne({ email: req.body.email }, (err, foundUser) => {
    if (err) return res.status(500).json({ status: 500, message: 'Something went wrong, please try again'});

    if (!foundUser) {
      return res.status(400).json({ status: 400, message: 'Email or password is incorrect'});
    }

    bcrypt.compare(req.body.password, foundUser.password, (err, isMatch) => {
      if (err) return res.status(500).json({ status: 500, message: 'Something went wrong, please try again'});

      if (isMatch) {
        req.session.currentUser = { id: foundUser._id };
        return res.status(200).json({ status: 200, message: 'Success', data: foundUser._id });
      } else {
        return res.status(400).json({ status: 400, message: 'Username or password is incorrect' });
      }
    });
  });
};

// POST Logout
const logout = (req, res) => {
  if (!req.session.currentUser) return res.status(401).json({ status: 401, message: 'Unauthorized' });
  req.session.destroy((err) => {
    if (err) return res.status(500).json({ status: 500, message: 'Something went wrong. Please try again' });
    res.sendStatus(200);
  });
};

module.exports = {
  register,
  login,
  logout
};