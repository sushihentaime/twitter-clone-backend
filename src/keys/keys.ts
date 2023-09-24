import { generateKeyPair } from 'crypto';
import { writeFile } from 'fs';

const generateAccessTokenKeys = () => {
	generateKeyPair(
		'rsa',
		{
			modulusLength: 4096,
			publicKeyEncoding: {
				type: 'spki',
				format: 'pem',
			},
			privateKeyEncoding: {
				type: 'pkcs8',
				format: 'pem',
			},
		},
		(error, publicKey, privateKey) => {
			if (error) {
				console.error(error);
			}

			writeFile('accesstoken_public_key.pem', publicKey, (error) => {
				if (error) {
					console.error('Failed to write file', error);
				}
				console.log('Public Key File written successfully');
			});

			writeFile('accesstoken_private_key.pem', privateKey, (error) => {
				if (error) {
					console.error('Failed to write file', error);
				}
				console.log('Private Key File written successfully');
			});
		}
	);
};

const generateRefreshTokenKeys = () => {
	generateKeyPair(
		'rsa',
		{
			modulusLength: 4096,
			publicKeyEncoding: {
				type: 'spki',
				format: 'pem',
			},
			privateKeyEncoding: {
				type: 'pkcs8',
				format: 'pem',
			},
		},
		(error, publicKey, privateKey) => {
			if (error) {
				console.error(error);
			}

			writeFile('refreshtoken_public_key.pem', publicKey, (error) => {
				if (error) {
					console.error('Failed to write file', error);
				}
				console.log('Public Key File written successfully');
			});

			writeFile('refreshtoken_private_key.pem', privateKey, (error) => {
				if (error) {
					console.error('Failed to write file', error);
				}
				console.log('Private Key File written successfully');
			});
		}
	);
};

generateRefreshTokenKeys();
generateAccessTokenKeys();
