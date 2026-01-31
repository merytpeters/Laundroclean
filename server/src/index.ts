import app from './app.js';
import config from './config/config.js';
import prisma from './config/prisma.js';
import logger from './middlewares/logger.js';

const PORT = Number(config.PORT) || 8000;

const startServer = async () => {
    try {
        await prisma.$connect();
        logger.info('Database Connected');

        app.listen(PORT, '::', ()=> {
            logger.info(`Server is running on port ${PORT}`);
        });
    } catch (err) {
        logger.error('Unable to connect to the database', err);
        process.exit(1);
    }
};


if (process.env.NODE_ENV !== 'test') {
    startServer();
}
