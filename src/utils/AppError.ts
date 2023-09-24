export enum HttpCode {
	OK = 200,
	NO_CONTENT = 204,
	BAD_REQUEST = 400,
	UNAUTHORIZED = 401,
	FORBIDDEN = 403,
	NOT_FOUND = 404,
	UNPROCESSABLE_ENTITY = 422,
	INTERNAL_SERVER_ERROR = 500,
}

interface AppErrorArgs {
	name?: string;
	httpCode: HttpCode;
	message: string;
}

class AppError extends Error {
	httpCode: HttpCode;
	constructor(args: AppErrorArgs) {
		super(args.message);
		Object.setPrototypeOf(this, new.target.prototype);
		this.name = args.name || 'Error';
		this.httpCode = args.httpCode;
	}
}

export default AppError;
