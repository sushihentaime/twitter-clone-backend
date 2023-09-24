import 'express-async-errors';
import express from 'express';
import { login, logout, refreshAccessToken, signup } from '../controllers/auth';
import { loginSchema, signupSchema } from '../validation/auth';
import validateRequest from '../middleware/validateRequest';
import {
	loginAuthentication,
	tokenAuthentication,
} from '../middleware/passportMiddleware';

const authRouter = express.Router();

authRouter.route('/signup').post(
	validateRequest({
		body: signupSchema,
	}),
	signup
);

authRouter.route('/login').post(
	loginAuthentication,
	validateRequest({
		body: loginSchema,
	}),
	login
);

authRouter.route('/refresh').post(tokenAuthentication, refreshAccessToken);

authRouter.route('/logout').post(tokenAuthentication, logout);

export default authRouter;
