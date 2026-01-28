import jwt from 'jsonwebtoken';
import type { Response, Request, NextFunction } from 'express';
import { UnauthenticatedError, UnauthorizedError } from './errorHandler.js';
import config from '../config/config.js';
import type { SessionPayload } from '../types/index.js';
import { UserType, CompanyRoleTitle } from '@prisma/client';
import { ROLE_HIERARCHY } from '../types/index.js';

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

  // Check if user type is in allowed list
  requireUserType(...allowedTypes: UserType[]) {
    return (req: Request, res: Response, next: NextFunction) => {
      if (!req.user) {
        return next(new UnauthenticatedError('Not authenticated'));
      }

      if (!allowedTypes.includes(req.user.type)) {
        return next(new UnauthorizedError('Access denied: Invalid user type'));
      }
      next();
    };
  }

  // Check if company user has one of the allowed roles
  requireRole(...roles: CompanyRoleTitle[]) {
    return (req: Request, res: Response, next: NextFunction) => {
      if (!req.user) {
        return next(new UnauthenticatedError('Not authenticated'));
      }

      if (req.user.type !== UserType.COMPANYUSER) {
        return next(new UnauthorizedError('Access denied: Company user required'));
      }

      if (!req.user.companyRoleTitle || !roles.includes(req.user.companyRoleTitle)) {
        return next(new UnauthorizedError('Access denied: Insufficient role'));
      }
      next();
    };
  }

  // Check if company user has minimum role level
  requireMinRole(minRole: CompanyRoleTitle) {
    return (req: Request, res: Response, next: NextFunction) => {
      if (!req.user) {
        return next(new UnauthenticatedError('Not authenticated'));
      }

      if (req.user.type !== UserType.COMPANYUSER) {
        return next(new UnauthorizedError('Access denied: Company user required'));
      }

      if (!req.user.companyRoleTitle) {
        return next(new UnauthorizedError('Access denied: No role assigned'));
      }

      const userLevel = ROLE_HIERARCHY[req.user.companyRoleTitle];
      const requiredLevel = ROLE_HIERARCHY[minRole];

      if (userLevel < requiredLevel) {
        return next(new UnauthorizedError('Access denied: Insufficient privileges'));
      }
      next();
    };
  }

  // Convenience: require CLIENT user
  requireClient() {
    return this.requireUserType(UserType.CLIENT);
  }

  // Convenience: require COMPANYUSER
  requireCompanyUser() {
    return this.requireUserType(UserType.COMPANYUSER);
  }

  // Convenience: ADMIN only
  requireAdmin() {
    return this.requireRole(CompanyRoleTitle.ADMIN);
  }
}

export default new UserAuth();
