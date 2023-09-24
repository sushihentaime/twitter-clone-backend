import { readFile } from 'node:fs/promises';
import { readFileSync } from 'node:fs';
import path from 'path';

export const readAccessTokenPublicKey = () => {
	return readFileSync(
		path.join(__dirname, '../keys/accesstoken_public_key.pem'),
		'utf-8'
	);
};

export const readAccessTokenPrivateKey = async () => {
	return readFile(
		path.join(__dirname, '../keys/accesstoken_private_key.pem'),
		'utf-8'
	);
};

export const readRefreshTokenPublicKey = async () => {
	return readFile(
		path.join(__dirname, '../keys/refreshtoken_public_key.pem'),
		'utf-8'
	);
};

export const readRefreshTokenPrivateKey = async () => {
	return readFile(
		path.join(__dirname, '../keys/refreshtoken_private_key.pem'),
		'utf-8'
	);
};
