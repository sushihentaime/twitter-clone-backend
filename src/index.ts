import app from './app';
import Logger from './utils/Logger';
import { port } from './config/config';

if (!port) {
	process.exit(1);
}

const server = app.listen(port, () =>
	Logger.info(`Server running on http://localhost:${port}`)
);

const exitHandler = (): void => {
	if (server) {
		server.close(() => {
			Logger.info('Server closed');
			process.exit(1);
		});
	} else {
		process.exit(1);
	}
};

const unexpectedErrorHandler = (error: unknown) => {
	Logger.error(error);
	exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);
