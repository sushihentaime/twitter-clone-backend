import bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import {
	readAccessTokenPrivateKey,
	readRefreshTokenPrivateKey,
} from '../config/cert';
import AppError, { HttpCode } from '../utils/AppError';
import {
	accessTokenExpirationMinutes,
	refreshTokenExpirationMinutes,
} from '../config/config';

export const hashPassword = async (password: string): Promise<string> => {
	return await bcrypt.hash(password, 10);
};

export const createAccessToken = async (user: Express.User | undefined) => {
	if (typeof user === 'undefined') {
		throw new AppError({
			httpCode: HttpCode.BAD_REQUEST,
			message: 'Invalid user',
		});
	}

	const cert = await readAccessTokenPrivateKey();
	const payload = {
		sub: user._id,
		username: user.username,
	};
	const token = jwt.sign(payload, cert, {
		expiresIn: accessTokenExpirationMinutes,
		algorithm: 'RS256',
	});

	return token;
};

export const createRefreshToken = async (user: Express.User | undefined) => {
	if (user === undefined) {
		throw new AppError({
			httpCode: HttpCode.BAD_REQUEST,
			message: 'Invalid user',
		});
	}

	const cert = await readRefreshTokenPrivateKey();
	const payload: {
		sub: string;
		name: string;
	} = {
		sub: String(user?._id),
		name: String(user?.name),
	};

	const token = jwt.sign(payload, cert, {
		expiresIn: refreshTokenExpirationMinutes,
		algorithm: 'RS256',
	});
	return token;
};
