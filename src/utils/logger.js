import { createLogger, format, transports } from 'winston';

const logger = createLogger({
    level: 'info',
    format: format.json(),
    defaultMeta: { service: 'user-service' },
    transports: [
        new transports.File({ filename: '.log/error.log', level: 'error' }),
        new transports.File({ filename: '.log/combined.log' })
    ]
});

export default logger;