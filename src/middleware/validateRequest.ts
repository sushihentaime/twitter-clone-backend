import { NextFunction, Request, Response } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import AppError, { HttpCode } from '../utils/AppError';

type RequestValidators = {
	params?: AnyZodObject;
	body?: AnyZodObject;
	query?: AnyZodObject;
};

const validateRequest =
	(validators: RequestValidators) =>
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			if (validators.params) {
				req.params = await validators.params.parseAsync(req.params);
			}
			if (validators.body) {
				req.body = await validators.body.parseAsync(req.body);
			}
			if (validators.query) {
				req.query = await validators.query.parseAsync(req.query);
			}
			next();
		} catch (error) {
			if (error instanceof ZodError) {
				const errorMessages = error.errors.map(
					(errorMessage) => errorMessage.message
				);
				throw new AppError({
					httpCode: HttpCode.BAD_REQUEST,
					message: JSON.stringify(errorMessages),
				});
			}
			next(error);
		}
	};

export default validateRequest;
