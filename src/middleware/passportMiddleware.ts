import passport from 'passport';
import { loginStrategy, tokenStrategy } from '../config/passport';
import { Request, Response, NextFunction } from 'express';

passport.use('login', loginStrategy);
passport.use('token', tokenStrategy);

export const loginAuthentication = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	// eslint-disable-next-line @typescript-eslint/no-unsafe-call
	passport.authenticate(
		'login',
		{ session: false },
		(
			err: Error,
			user: Express.User | undefined,
			info: { message: string | undefined }
		) => {
			if (err || !user) {
				const error = err || new Error(info.message);
				return next(error);
			}
			req.user = user;
			return next();
		}
	)(req, res, next);
};

export const tokenAuthentication = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	// eslint-disable-next-line @typescript-eslint/no-unsafe-call
	passport.authenticate(
		'token',
		{ session: false },
		(
			err: Error,
			user: Express.User | undefined,
			info: { message: string | undefined }
		) => {
			if (err || !user) {
				const error = err || new Error(info.message);
				return next(error);
			}
			req.user = user;
			return next();
		}
	)(req, res, next);
};
