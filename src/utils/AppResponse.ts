import { Response } from 'express';

interface IAppResponse {
	status: 'success';
	statusCode: number;
	data: unknown;
}

const AppResponse = (res: Response, data: unknown, statusCode: number) => {
	const responseBody: IAppResponse = {
		status: 'success',
		statusCode,
		data,
	};
	return res.status(statusCode).json(responseBody);
};

export default AppResponse;
