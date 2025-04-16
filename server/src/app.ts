import * as dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import mongoose from 'mongoose';
import passport from 'passport';
import session from 'express-session';
import MongoStore from 'connect-mongo';

import './config/passport';
import authRoute from './routes/auth';
import contractRoute from './routes/contract';
import paymentsRoute from "./routes/payments";
// import {handleWebhook} from "./controllers/payment.controller";

const app = express();
const port = process.env.PORT || 8000;

// Middleware
app.use(cors(
  {
    origin:'http://localhost:3000',
    credentials:true,
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
  }
));

app.options('*', cors({
  origin: process.env.CLIENT_URI,
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
}))




app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

(async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log('Database Connected');

    // Initialize session store
    const store = MongoStore.create({
      mongoUrl: process.env.MONGODB_URI!,
      collectionName: 'sessions'
    });


    app.use(
      session({
        secret: process.env.SESSION_SECRET!,
        resave: false,
        saveUninitialized: false,
        store,
        cookie: {
          secure: process.env.NODE_ENV === 'production',
          sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
          maxAge: 24 * 60 * 60 * 1000, // 1 day
        },
      })
    );

    app.use(passport.initialize());
    app.use(passport.session());

    // Routes
    app.use('/', authRoute);
    app.use('/contracts', contractRoute);
    app.use("/payments", paymentsRoute);

    // Root route
    app.get('/', (req, res) => {
      res.send('Working');
    });

    // Start server
    app.listen(port, () => {
      console.log(`Server running on port: ${port}`);
    });
  } catch (error) {
    console.error('Error connecting to the database:', error);
    process.exit(1);
  }
})();





