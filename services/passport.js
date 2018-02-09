require('dotenv').config();
const bcrypt = require('bcrypt');
const passport = require('passport');
const User = require('../models/UserModel');
const Jwt = require('passport-jwt');
const LocalStrategy = require('passport-local').Strategy;

const signinStrategy = new LocalStrategy(function (username, password, done) {
    User.findOne({ username }).exec()
        .then(user => {
            if (!user) {
                return done(null, false);
            }

            bcrypt.compare(password, user.password,  function (err, isMatch) {
                if (err) {
                    return done(err, false);
                }

                if (!isMatch) {
                    return done(null, false);
                }

                return done(null, user);
            });
        })
        .catch(err => done(err, false));
});

const jwtOptions = {
    secretOrKey: process.env.SECRET,
    jwtFromRequest: Jwt.ExtractJwt.fromHeader('authorization')
}

const JwtStrategy = Jwt.Strategy;
const authStrategy = new JwtStrategy(jwtOptions, function (payload, done) {
    User.findById(payload.userId, function (err, user) {
        if (err) {
            return done(err, false);
        }

        if (user) {
            done(null, user);
        } else {
            done(null, false);
        }
    });
});

passport.use('signinStrategy', signinStrategy);
passport.use('authStrategy', authStrategy);