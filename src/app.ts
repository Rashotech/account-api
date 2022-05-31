import express, { Application, Request, Response, NextFunction } from 'express';
import passport from 'passport';
import cors from 'cors';
import compression from 'compression';
import jwtStrategy from './config/passport';
import path from 'path';
import error from './middleware/error';
import httpStatus from 'http-status';
import ApiError from './helpers/ApiError';

declare global {
    var __root: string
}

global.__root = path.join(__dirname);

// Routes
import AuthRoutes from './routes/auth.route';
import AccountRoutes from './routes/account.route';

// Express App
const app:Application = express();

// CORS
const corsOptions = {
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    optionsSuccessStatus: 204,
};  
app.use(cors(corsOptions));

app.use(express.json());
app.use(compression());

// jwt authentication
app.use(passport.initialize());
passport.use('jwt', jwtStrategy);

// API routes
app.use('/api/auth', AuthRoutes);
app.use('/api/account', AccountRoutes);

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});
  
  // convert error to ApiError, if needed
app.use(error.errorConverter);
  
  // handle error
app.use(error.errorHandler);

export default app;

