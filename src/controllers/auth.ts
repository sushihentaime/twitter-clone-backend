import { Request, Response } from 'express';
import {
	createAccessToken,
	createRefreshToken,
	hashPassword,
} from '../services/auth';
import AppResponse from '../utils/AppResponse';
import { LoginSchema, SignupSchema } from '../validation/auth';
import { createUser, getUserByUserId } from '../services/user';
import AppError, { HttpCode } from '../utils/AppError';
import { initProfile } from '../services/profile';
import { readRefreshTokenPublicKey } from '../config/cert';
import {
	JsonWebTokenError,
	JwtPayload,
	TokenExpiredError,
	verify,
} from 'jsonwebtoken';

export const signup = async (
	req: Request<{}, {}, SignupSchema>,
	res: Response
) => {
	const { password }: { password: string } = req.body;
	const passwordHash = await hashPassword(password);
	const user = await createUser({
		...req.body,
		passwordHash,
	});
	return AppResponse(res, user, 201);
};

export const login = async (
	req: Request<{}, {}, LoginSchema>,
	res: Response
) => {
	if (typeof req.user === 'undefined') {
		throw new AppError({
			httpCode: HttpCode.BAD_REQUEST,
			message: 'User is not found in request header',
		});
	}
	const accessToken = await createAccessToken(req.user);
	const refreshToken = await createRefreshToken(req.user);

	res.cookie('refresh_token', refreshToken, {
		httpOnly: true,
		sameSite: 'none',
		secure: true,
		maxAge: 7 * 24 * 60 * 60 * 1000,
	});

	await initProfile(req.user._id);
	return AppResponse(res, accessToken, 200);
};

export const refreshAccessToken = async (req: Request, res: Response) => {
	try {
		const refreshToken = req.cookies.refresh_token as string;
		if (!refreshToken) {
			throw new AppError({
				httpCode: HttpCode.UNAUTHORIZED,
				message: 'Refresh token not found in request cookies',
			});
		}
		const cert = await readRefreshTokenPublicKey();

		let decodedToken: string | JwtPayload | undefined;

		verify(refreshToken, cert, { algorithms: ['RS256'] }, (error, decoded) => {
			if (error) {
				throw new AppError({
					httpCode: HttpCode.UNAUTHORIZED,
					message: error.message,
				});
			}
			decodedToken = decoded;
			return;
		});

		if (
			typeof decodedToken === 'string' ||
			typeof decodedToken === 'undefined'
		) {
			throw new AppError({
				httpCode: HttpCode.UNAUTHORIZED,
				message: 'Decoded token is not in the right format',
			});
		}

		const user = await getUserByUserId(decodedToken.sub as string);
		const accessToken = await createAccessToken(user);
		return AppResponse(res, accessToken, 200);
	} catch (error) {
		if (error instanceof TokenExpiredError) {
			throw new AppError({
				httpCode: HttpCode.UNAUTHORIZED,
				message: 'Refresh token has expired',
			});
		} else if (error instanceof JsonWebTokenError) {
			throw new AppError({
				httpCode: HttpCode.UNAUTHORIZED,
				message: 'Invalid refresh token',
			});
		} else {
			throw new AppError({
				httpCode: HttpCode.BAD_REQUEST,
				message: 'Error refreshing access token',
			});
		}
	}
};

export const logout = (req: Request, res: Response) => {
	res.cookie('refresh_token', '', { maxAge: 0 });
	return AppResponse(res, 'Logout successfully', 200);
};
