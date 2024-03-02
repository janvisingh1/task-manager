const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const flash = require('express-flash');
const path = require('path');

const app = express();
// const server = http.createServer(app);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));


mongoose.connect('mongodb+srv://test1:1234@cluster0.ierqo1l.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');

const User = require('./models/User');



passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: 'your-secret-key', resave: false, saveUninitialized: true }));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

// Your routes go here (see below)

const indexRouter = require('./routes/index');
app.use('/', indexRouter);

module.exports = app;
