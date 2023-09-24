import mongoose from 'mongoose';
import { db } from '../config/config';
import Logger from './Logger';

mongoose.set('strictQuery', false);

mongoose
	.connect(db)
	.then(() => {
		Logger.info('Connected to MongDB');
	})
	.catch((error) => {
		Logger.error('MongoDB connection error', error);
	});

export const dbClient = mongoose.connection.getClient();
