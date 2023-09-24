import { NextFunction, Request, Response } from 'express';
import { Model } from 'mongoose';
import AppError, { HttpCode } from '../utils/AppError';

function pagination(
	model: Model<Document, {}>
): (req: Request, res: Response, next: NextFunction) => void {
	return async (req: Request, res: Response, next: NextFunction) => {
		if (
			typeof req.query.page !== 'string' ||
			typeof req.query.limit !== 'string'
		) {
			throw new AppError({
				httpCode: HttpCode.INTERNAL_SERVER_ERROR,
				message: `The page & limit parameter are not of type string`,
			});
		}

		const page = parseInt(req.query.page);
		let limit = parseInt(req.query.limit);

		if (limit > 10) {
			limit = 10;
		}

		const startIndex = (page - 1) * limit;
		const endIndex = page * limit;

		type results = {
			next?: { page: number; limit: number };
			previous?: { page: number; limit: number };
			results: Array<object>;
		};

		const results: results = {
			results: [],
		};

		if (endIndex < (await model.countDocuments().exec())) {
			results.next = {
				page: page + 1,
				limit: limit,
			};
		}

		if (startIndex > 0) {
			results.previous = {
				page: page - 1,
				limit: limit,
			};
		}

		try {
			results.results = await model.find().limit(limit).skip(startIndex).exec();
			res.locals.paginatedResults = results;
			next();
		} catch (error) {
			if (error instanceof Error) {
				throw new AppError({
					httpCode: HttpCode.INTERNAL_SERVER_ERROR,
					message: error.message,
				});
			} else {
				throw new AppError({
					httpCode: HttpCode.INTERNAL_SERVER_ERROR,
					message: JSON.stringify(error),
				});
			}
		}
	};
}

export default pagination;
