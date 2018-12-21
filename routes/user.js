const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport');

// Load User model
require('../models/User');
const User = mongoose.model('user');


// User Login route
router.get('/login', (req, res) => {
    if (req.isAuthenticated()) {
        req.flash('s_msg', 'You are already logged in');
        res.redirect('/todo');
    } else {
        res.render('users/login');
    }
});

// User Registration route
router.get('/register', (req, res) => {
    if (req.isAuthenticated()) {
        req.flash('e_msg', 'You need to log out to register a new account');
        res.redirect('/todo');
    } else {
        res.render('users/register');
    }
});

// Login Form POST route
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/todo',
        failureRedirect: '/user/login',
        failureFlash: true
    })(req, res, next);
});


// Register Form POST Route
router.post('/register', (req, res) => {
    let errors = [];

    if (req.body.password != req.body.cpassword) {
        errors.push({
            text: 'Passwords don\'t match'
        });
    }
    if (req.body.password.length < 4) {
        errors.push({
            text: 'Passwords must be at least 4 characters long'
        });
    }
    if (errors.length > 0) {
        res.render('users/register', {
            errors: errors,
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            cpassword: req.body.cpassword
        });
    } else {
        User.findOne({
                email: req.body.email
            })
            .then(user => {
                if (user) {
                    req.flash('e_msg', 'Email already registered');
                    res.redirect('/user/register')
                } else {
                    const newUser = new User({
                        name: req.body.name,
                        email: req.body.email,
                        password: req.body.password
                    });

                    bcrypt.hash(newUser.password, 10, (err, hash) => {
                        if (err) throw err;
                        newUser.password = hash;
                        newUser.save()
                            .then(user => {
                                req.flash('s_msg', 'Registered successfully! Now you can log in.');
                                res.redirect('/user/login')
                            })
                            .catch(err => {
                                console.log(err);
                                req.flash('e_msg', 'There was some error');
                                return;
                            });
                    });
                }
            });

    }
});

// Logout User
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('s_msg', 'You are logged out');
    res.redirect('/user/login');
});

module.exports = router;