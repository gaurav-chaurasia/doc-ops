const passport = require('passport');
const GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;
const refresh = require('passport-oauth2-refresh');
const moment = require('moment');
const config = require('../config/config')[process.env.NODE_ENV || 'development'];
const User = require('../models/user.model'); 


passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});


const googleStrategyConfig = new GoogleStrategy({
        clientID: process.env.GOOGLE_OAUTH2_CLIENT_ID,
        clientSecret: process.env.GOOGLE_OAUTH2_CLIENT_SECRET,
        callbackURL: 'http://localhost:3000/auth/google/callback',
        passReqToCallback: true
    },
    async (request, accessToken, refreshToken, params, profile, done) => {
        try {
            const user = await User.findOne({ google: profile.id });
            if (user) {
                return done(null, user);
            } else {
                const new_user = await User.create({
                    email: profile.email,
                    profile: {
                        name: profile.displayName,
                        gender: profile.gender || profile._json.gender,
                        picture: profile.picture,
                    },
                    email_verified: profile.verified,
                });
                new_user.google = profile.id;
                new_user.tokens.push({
                    kind: 'google',
                    accessToken,
                    accessTokenExpires: moment().add(params.expires_in, 'seconds').format(),
                    refreshToken,
                });
                return done(null, new_user);
            }
        } catch (err) {
            return done(err, null);
        }
    }
);
passport.use('google', googleStrategyConfig);
refresh.use('google', googleStrategyConfig);

//  * Login Required middleware.
exports.is_authenticated = (req, res, next) => {
	if (req.user || req.isAuthenticated()) {
        return next();
    }
	else {
        req.flash('info', { msg: 'You are not authenticated!'});
		res.redirect('/login');
	}
};