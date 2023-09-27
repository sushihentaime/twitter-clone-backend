import { Request, Response } from 'express';
import { search } from '../services/user';
import AppError, { HttpCode } from '../utils/AppError';
import AppResponse from '../utils/AppResponse';
import { UsernameSchema } from '../validation/user';

export const searchUser = async (
	req: Request<UsernameSchema>,
	res: Response
) => {
	const { username } = req.query;
	if (typeof username !== 'string') {
		return new AppError({
			httpCode: HttpCode.INTERNAL_SERVER_ERROR,
			message: 'the query name is not of type string',
		});
	}
	const users = await search(username);
	return AppResponse(res, users, 200);
};
