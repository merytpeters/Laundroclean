import type { Request, Response, NextFunction } from 'express';
import config from '../config/config.js';
import logger from './logger.js';

class ValidationError extends Error {
    statusCode: number;

    constructor(message: string) {
        super(message);
        this.name = 'ValidationError';
        this.statusCode = 400;
    }
}


class UnauthenticatedError extends Error {
    statusCode: number;

    constructor(message: string) {
        super(message);
        this.name = 'UnauthenticatedError';
        this.statusCode = 401;
    }
}


class UnauthorizedError extends Error {
    statusCode: number;

    constructor(message: string) {
        super(message);
        this.name = 'UnauthorizedError';
        this.statusCode = 403;
    }
}


class NotFoundError extends Error {
    statusCode: number;

    constructor(message: string) {
        super(message);
        this.name = 'NotFoundError';
        this.statusCode = 404;
    }
}

class ConflictError extends Error {
    statusCode: number;

    constructor(message: string) {
        super(message);
        this.name = 'ConflictError';
        this.statusCode = 409;
  }
}


const notFoundHandler = () => {
    throw new NotFoundError('route not found');
};


const errorHandler = (
    err: Error & { statusCode: number},
    req: Request,
    res: Response,
    _next: NextFunction
) => {
    let { statusCode = 500, message } = err;

    if (!err.statusCode || err.statusCode >= 500 ) {
        message = 'Internal Server Error';
    }

    logger.error(`${err.message}, \n_Stack:_ ${err.stack}`);

    res.status(statusCode).json({
        success: false,
        message,
        error: config.NODE_ENV === 'development' ? err.stack : undefined,
   });
};


export {
    ValidationError,
    UnauthenticatedError,
    UnauthorizedError,
    NotFoundError,
    notFoundHandler,
    errorHandler,
    ConflictError
};
