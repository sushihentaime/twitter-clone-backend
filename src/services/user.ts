import User from '../models/users';
import AppError, { HttpCode } from '../utils/AppError';

type IUserBody = {
	name: string;
	username: string;
	email: string;
	passwordHash: string;
};

export const createUser = async (userBody: IUserBody) => {
	const { name, username, email, passwordHash } = userBody;
	if (
		(await User.isEmailTaken(email)) &&
		(await User.isUsernameTaken(username)) &&
		(await User.isNameTaken(name))
	) {
		throw new AppError({
			httpCode: HttpCode.BAD_REQUEST,
			message: 'User has already signed up',
		});
	}
	if (await User.isEmailTaken(email)) {
		throw new AppError({
			httpCode: HttpCode.BAD_REQUEST,
			message: 'Email already taken',
		});
	}
	if (await User.isUsernameTaken(username)) {
		throw new AppError({
			httpCode: HttpCode.BAD_REQUEST,
			message: 'Username already taken',
		});
	}
	if (await User.isNameTaken(name)) {
		throw new AppError({
			httpCode: HttpCode.BAD_REQUEST,
			message: 'Name already taken',
		});
	}
	return User.create({
		name,
		username,
		email,
		passwordHash,
	});
};

export const getUserByUsername = async (username: string) => {
	const user = await User.findOne({ username });
	if (!user) {
		throw new AppError({
			httpCode: HttpCode.NOT_FOUND,
			message: 'User not found',
		});
	}
	return user;
};

export const getUserByUserId = async (userId: string) => {
	const user = await User.findById(userId);
	if (!user) {
		throw new AppError({
			httpCode: HttpCode.NOT_FOUND,
			message: 'User not found',
		});
	}
	return user;
};
