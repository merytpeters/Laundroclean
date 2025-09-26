import type { Request, Response, NextFunction } from 'express';
import { createLogger, format, transports } from 'winston';

const logger = createLogger({
    level: 'info',
    transports: [],
})

logger.add(
  new transports.Console({
    format: format.combine(
      format.timestamp(),
      format.printf(({ timestamp, level, message }) => {
        return `${timestamp} [${level.toUpperCase()}]: ${message}`
      })
    ),
  })
)

const appLogger = (req: Request, res: Response, next: NextFunction) => {
    const start = process.hrtime.bigint()

    res.on('finish', () => {
        const end = process.hrtime.bigint()
        const durationMs = Number(end - start) / 1_000_000
        logger.info(
            `${req.method} ${req.originalUrl} ${
                res.statusCode
            } - ${durationMs.toFixed(2)} ms`
        )
    })
    next()
}

export { logger as default, appLogger}
