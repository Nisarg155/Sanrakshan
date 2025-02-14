// import passport from 'passport';
// import {Strategy as GoogleStrategy} from "passport-google-oauth20";
// import User, {IUser} from "../models/user.model";

// passport.use(<passport.Strategy>new GoogleStrategy({
//         clientID: process.env.GOOGLE_CLIENT_ID!,
//         clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
//         callbackURL: "/auth/google/callback",
//     }, async (accessToken, refreshToken, profile, done) => {
//         try {
//             let user = await User.findOne({googleId: profile.id});
//             if (!user) {
//                 user = await User.create({
//                     googleId: profile.id,
//                     email: profile.emails![0].value,
//                     displayName: profile.displayName,
//                     profilePicture: profile.photos![0].value
//                 })
//             }
//             done(null, user)
//         } catch (error) {
//             done(error as Error, undefined)
//         }
//     }
// ))

// passport.serializeUser((user: any, done) => {
//     done(null, user._id);
// })
// passport.deserializeUser((id, done) => {
//     const user =  User.findById(id);
//     done(null,user);
// })

import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User, { IUser } from '../models/user.model';

passport.use(
  <passport.Strategy>new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: '/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ googleId: profile.id });
        if (!user) {
          user = await User.create({
            googleId: profile.id,
            email: profile.emails![0].value,
            displayName: profile.displayName,
            profilePicture: profile.photos![0].value, // Storing the profile picture URL
          });
        }
        done(null, user);
      } catch (error) {
        done(error as Error, undefined);
      }
    }
  )
);

passport.serializeUser((user: any, done) => {
  done(null, user._id); // Serialize the user's ID to store in the session
});

passport.deserializeUser(async (id: string, done) => {
  try {
    // Fetch the full user details, including the profile picture
    const user = await User.findById(id);
    if (user) {
      done(null, user); // User is attached to req.user
    } else {
      done(new Error('User not found'), null);
    }
  } catch (error) {
    done(error, null); // Handle any errors during deserialization
  }
});
