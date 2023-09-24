import 'dotenv/config';

export const port: number = parseInt(process.env.PORT as string, 10);

export const db: string = process.env.DATABASE_URL as string;

export const accessTokenExpirationMinutes: string = process.env
	.ACCESS_TOKEN_EXPIRATION_MINUTES as string;

export const refreshTokenExpirationMinutes: string = process.env
	.REFRESH_TOKEN_EXPIRATION_MINUTES as string;
