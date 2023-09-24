import 'express-async-errors';
import express from 'express';
import helmet from 'helmet';
import {
	handleNotFound,
	errorConverter,
	errorHandler,
} from './middleware/ErrorHandler';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import authRouter from './routes/auth';
import postRouter from './routes/post';
import profileRouter from './routes/profile';
import './utils/db';

const app = express();

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(morgan('dev'));
app.use(passport.initialize());

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/posts', postRouter);
app.use('/api/v1/profiles', profileRouter);

app.use(handleNotFound);
app.use(errorConverter);
app.use(errorHandler);

export default app;
