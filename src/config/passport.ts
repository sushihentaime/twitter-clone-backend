import * as passportLocal from 'passport-local';
import passportJWT from 'passport-jwt';
import User from '../models/users';
import { readAccessTokenPublicKey } from './cert';

const LocalStrategy = passportLocal.Strategy;

const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

export const loginStrategy = new LocalStrategy(
	async (username: string, password: string, done) => {
		try {
			const user = await User.findOne({ username });
			if (!user) {
				return done(null, false, { message: 'User not found' });
			}
			const validate = await user.isValidPassword(password);
			if (!validate) {
				return done(null, false, { message: 'Incorrect password' });
			}
			return done(null, user, { message: 'Logged in successfully' });
		} catch (error) {
			done(error);
		}
	}
);

export const tokenStrategy = new JWTStrategy(
	{
		jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
		secretOrKey: readAccessTokenPublicKey(),
		algorithms: ['RS256'],
	},
	async (jwtPayload, done) => {
		try {
			const user = await User.findById(jwtPayload.sub);
			if (!user) {
				return done(null, false, { message: 'User not found' });
			}
			return done(null, user);
		} catch (error) {
			return done(error);
		}
	}
);
