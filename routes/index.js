const express = require('express');
const router = express.Router();
const User = require('../models/User');
const passport = require('passport');
const tasksRouter = require('./tasks');
const Task = require('../models/Task');

router.get('/', (req, res) => {
    res.render('index', { user: req.user, message: req.flash('error') });
});

router.get('/register', (req, res) => {
    res.render('register', { message: req.flash('error') });
});

router.get('/dashboard', isLoggedIn, async (req, res) => {
    const userId = req.user._id;
    const userTasks = await Task.find({ user: userId });
    res.render('dashboard', { user: req.user, tasks: userTasks });
});


router.post('/login', (req, res, next) => {
    console.log('Received login POST request');
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/',
        failureFlash: true
    })(req, res, next);
});


router.post('/register', (req, res) => {
    const { username, password } = req.body;



    // Create a new user
    const newUser = new User({ username: username });
    User.register(newUser, password).then(function () {
        passport.authenticate('local')(req, res, function () {
            res.redirect('/dashboard');
        })
    })
});


router.get('/logout', function (req, res) {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        res.redirect('/');
    });
});

router.use('/tasks', isLoggedIn, tasksRouter);


  

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.redirect('/');
}

module.exports = router;
