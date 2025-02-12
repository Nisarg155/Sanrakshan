import passport from 'passport';
import {Strategy as GoogleStrategy} from "passport-google-oauth20";
import User, {IUser} from "../models/user.model";

passport.use(<passport.Strategy>new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        callbackURL: "/auth/google/callback",
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            let user = await User.findOne({googleId: profile.id});
            if (!user) {
                user = new User({
                    googleId: profile.id,
                    emailL: profile._json.email,
                    displayName: profile.displayName,
                    profilePicture: profile._json.picture
                })
            }
            done(null, user)
        } catch (error) {
            done(error as Error, undefined)
        }
    }
))

passport.serializeUser((user: any, done) => {
    done(null, user._id);
})
passport.deserializeUser((id, done) => {
    const user =  User.findById(id);
    done(null,user);
})