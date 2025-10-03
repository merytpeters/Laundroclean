import jwt from 'jsonwebtoken';
import type { Response, Request, NextFunction } from 'express';
import { UnauthenticatedError, UnauthorizedError } from './errorHandler.js';
import config from '../config/config.js';
import type { SessionPayload } from '../types/index.js';
import { UserType, CompanyRoleTitle } from '@prisma/client';

class UserAuth {
  authenticate() {
    return (req: Request, res: Response, next: NextFunction) => {
      try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
          return next(new UnauthenticatedError('You need to login'));
        }

        const token = authHeader.substring(7);
        const decoded = jwt.verify(token, config.JWT_SECRET) as SessionPayload;

        if (!decoded || !decoded.type) {
          return next(new UnauthenticatedError('Invalid token payload'));
        }
        req.user = decoded;

        next();
      } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
          return next(new UnauthenticatedError('Invalid token'));
        }
        return next(error);
      }
    };
  }

  authorize(requiredRole: CompanyRoleTitle) {
    return (req: Request, res: Response, next: NextFunction) => {
      if (!req.user) {
        return next(new UnauthenticatedError('Not authenticated'));
      }

      if (req.user.type !== UserType.COMPANYUSER) {
        return next(new UnauthorizedError('Access denied'));
      }

      if (req.user.companyRoleTitle !== requiredRole) {
        return next(new UnauthorizedError('Access denied'));
      }

      next();
    };
  }

  authorizeMultipleUser(allowedUsers: UserType[]) {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) {
            return next(new UnauthenticatedError('Not authenticated'));
        }

        if (!req.user.type) {
            return next(new UnauthorizedError('Access denied'));
        }
        next()
    };
  }
}

export default new UserAuth();
