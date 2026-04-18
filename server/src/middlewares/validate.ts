import z from 'zod';
import type { Request, Response, NextFunction } from 'express';
import { ValidationError } from './errorHandler.js';

type InputTarget = 'body' | 'params' | 'query';

const validate = (schema: z.ZodTypeAny, target: InputTarget = 'body') => {
    return (req: Request, res: Response, next: NextFunction) => {
       const result = schema.safeParse(req[target]);

        if (!result.success) {
            return next(
                new ValidationError(result.error.issues.map(err => err.message).join(', '))
            );
        }

        if (target === 'query' && typeof req.query === 'object') {
            Object.assign(req.query, result.data as object);
        } else {
            // @ts-ignore - dynamic assignment to Request fields
            req[target] = result.data;
        }
        next();
    };
};

export default validate;