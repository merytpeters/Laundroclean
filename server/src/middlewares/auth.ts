import jwt from 'jsonwebtoken';
import type { Response, Request, NextFunction } from 'express';
import { UnauthenticatedError, UnauthorizedError } from './errorHandler.js';
import type { JWTPayload } from '../modules/token/token.types.js';
import { UserType, CompanyRoleTitle } from '@prisma/client';
import { ROLE_HIERARCHY } from '../types/index.js';
import prisma from '../config/prisma.js';
import tokenService from '../modules/token/token.service.js';

class UserAuth {
  authenticate() {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
          return next(new UnauthenticatedError('You need to login'));
        }

        const token = authHeader.substring(7);
        const decoded = tokenService.verifyToken(token) as JWTPayload;

        if (!decoded || !decoded.id || !decoded.type) {
          return next(new UnauthenticatedError('Invalid token payload'));
        }
        const user = await prisma.user.findUnique({ where: { id: decoded.id } });

        if (!user || !user.isActive) {
          return next(new UnauthorizedError('Account inactive or deleted'));
        }

        req.user = user;

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

      if (!req.user.role || !roles.includes(req.user.role)) {
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

      if (!req.user.role) {
        return next(new UnauthorizedError('Access denied: No role assigned'));
      }

      const userLevel = ROLE_HIERARCHY[req.user.role];
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

  requireCompanyAdmin() {
    return (req: Request, res: Response, next: NextFunction) => {
      this.authenticate()(req, res, (authErr?: any) => {
        if (authErr) return next(authErr);
        this.requireCompanyUser()(req, res, (err?: any) => {
          if (err) return next(new UnauthorizedError('Access denied: Must be a company user'));
          this.requireAdmin()(req, res, (err?: any) => {
            if (err) return next(new UnauthorizedError('Access denied: Must be an admin'));
            next();
          });
        });
      });
    };
  }

}

export default new UserAuth();
