import * as dotenv from 'dotenv';

dotenv.config();
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
// import  morgan from 'morgan';
import mongoose from 'mongoose';
import passport from 'passport';
import "./config/passport"
import authRoute from "./routes/auth"
import session from "express-session"
import MongoStore from "connect-mongo";


const app = express();
const port = process.env.PORT || 8000;


// Use Mongoose's connection in MongoStore
let store;


app.use(cors());
app.use(helmet())
// app.use(morgan('dev'));dev
app.use(express.json());
app.use(session({
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
    // store,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? "none" : "lax",
        maxAge: 24 * 60 * 60 * 1000,
    }
}))
app.use(passport.initialize());
app.use(passport.session());
app.use("/auth", authRoute);


app.listen(port, () => {
    console.log("hello")
    mongoose.connect(process.env.MONGODB_URI!).then(r => {
        console.log("Database Connected")
        // store = new MongoStore({
        //     client: mongoose.connection.getClient(), // Use the existing connection
        //     collectionName: "sessions", // Optional: Specify a custom collection for sessions
        // });
    })
    console.log(`Server running on port: ${port}`);
})



