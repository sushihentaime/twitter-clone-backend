import { NextFunction, Request, Response } from 'express';
import AppError, { HttpCode } from '../utils/AppError';
import Logger from '../utils/Logger';

export const handleNotFound = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const error = new AppError({
		httpCode: HttpCode.NOT_FOUND,
		message: `Not Found - ${req.originalUrl}`,
	});
	next(error);
};

export const errorConverter = (
	error: Error,
	req: Request,
	res: Response,
	next: NextFunction
) => {
	let convertedError = error;
	if (!(error instanceof AppError)) {
		convertedError = new AppError({
			httpCode: HttpCode.INTERNAL_SERVER_ERROR,
			message: error.message,
		});
	}
	next(convertedError);
};

export const errorHandler = (
	error: AppError,
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { httpCode, message, name } = error;

	if (process.env.NODE_ENV === 'development') {
		Logger.error(error);
	} else {
		Logger.error(message);
	}

	res.status(httpCode).send({
		name,
		httpCode,
		message,
	});
	next();
};
