const express = require('express');
const jwt = require('jwt-simple');
const User = require('../models/UserModel');
const bcrypt = require('bcrypt');
const passport = require('passport');
const passportService = require('../services/passport');

const router = express.Router();

const signinStrategy = passport.authenticate('signinStrategy', { session: false });

function tokenForUser(user) {
    const timestamp = new Date().getTime();
    return jwt.encode({ userId: user.id, iat: timestamp }, process.env.SECRET);
}

router.post('/api/signin', signinStrategy, function (req, res) {
    res.json({ token: tokenForUser(req.user)});
});

router.post('/api/signup', function (req, res, next) {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(422)
            .json({ error: 'You must provide a username and password' });
    }

    User.findOne({ username }).exec()
        .then(existingUser => {
            if (existingUser) {
                return res.status(422).json({ error: 'Username is taken, please try another' });
            }

            bcrypt.hash(password, 10, function (error, hashedPassword) {
                if (error) {
                    return next(error);
                }

                const user = new User({ username, password: hashedPassword });

                user.save()
                    .then(newUser => res.json({ token: tokenForUser(newUser) }));
            });
        })
        .catch(err => next(err));
});

module.exports = router;