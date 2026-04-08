import jwt from 'jsonwebtoken';
import type { Response, Request, NextFunction } from 'express';
import { UnauthenticatedError, UnauthorizedError } from './errorHandler.js';
import type { JWTPayload } from '../modules/token/token.types.js';
import { UserType } from '@prisma/client';
import prisma from '../config/prisma.js';
import tokenService from '../modules/token/token.service.js';
import CalendarService from '../modules/admin/companyuser.calendar/calendar.service.js';
import { PERMISSIONS } from '../constants/permissions.js';

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
        const user = await prisma.user.findUnique({ where: { id: decoded.id }, include: { role: true } });

        if (!user) {
          return next(new UnauthenticatedError('User not found'));
        }

        if (!user.isActive && user.role?.title !== 'ADMIN') {
          return next(new UnauthorizedError('Account inactive or deleted'));
        }

        req.user = {
          ...user,
          role: user.role ? { ...user.role, level: user.role.level ?? 0 } : null,
        };

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

  // Require a specific role (by title)
  requireRole(...titles: string[]) {
    return (req: Request, res: Response, next: NextFunction) => {
      if (!req.user) return next(new UnauthenticatedError('Not authenticated'));
      if (req.user.type !== UserType.COMPANYUSER) {
        return next(new UnauthorizedError('Access denied: Company user required'));
      }
      if (!req.user.role || !titles.includes(req.user.role.title)) {
        return next(new UnauthorizedError('Access denied: Insufficient role'));
      }
      next();
    };
  }

  requirePermission = (permission: string, minLevel?: number) => {
    return (req: Request, res: Response, next: NextFunction) => {
      if (!req.user || !req.user.role) {
        return next(new UnauthorizedError('Access denied: No role assigned'));
      }

      const userRole = req.user.role;

      // Level check
      if (minLevel && (userRole.level ?? 0) < minLevel) {
        return next(new UnauthorizedError('Access denied: Insufficient role level'));
      }

      // Permission check
      const permissions = userRole.permissions ?? [];
      if (!(permissions.includes('*') || permissions.includes(permission))) {
        return next(new UnauthorizedError('Access denied: Missing permission'));
      }

      next();
    };
  };

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
    return this.requireRole('ADMIN');
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

  // Allow access when the requesting user is the owner of the staff calendar(s)
  // For list endpoints: if `userId` query param is missing, default to the current user.
  // If provided and differs from the requester, require the calendar:view permission.
  allowOwnOrPermissionForCalendarList() {
    return (req: Request, res: Response, next: NextFunction) => {
      const q: any = req.query || {};
      const currentUserId = req.user?.id as string | undefined;
      if (!q.userId) {
        try {
          (req.query as any).userId = currentUserId;
        } catch (e) {
          // fallback: do not reassign req.query (some environments provide a getter-only property)
        }
        return next();
      }
      if (q.userId === currentUserId) return next();
      return this.requirePermission(PERMISSIONS.CALENDAR.VIEW)(req, res, next);
    };
  }

  // Allow access to a single calendar if the requester is the owner; otherwise require permission.
  allowOwnOrPermissionForCalendarById() {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { calendarId } = req.params as any;
        const currentUserId = req.user?.id as string | undefined;
        const calendar = await CalendarService.getStaffCalendar({ id: calendarId }, false);
        if (!calendar) return res.status(404).json({ success: false, message: 'Staff calendar not found' });
        if (calendar.userId === currentUserId) return next();
        return this.requirePermission(PERMISSIONS.CALENDAR.VIEW)(req, res, next);
      } catch (err) {
        return next(err);
      }
    };
  }

  // Allow access to a single timeslot if the requester owns the parent calendar; otherwise require permission.
  allowOwnOrPermissionForTimeslotById() {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { timeslotId } = req.params as any;
        const currentUserId = req.user?.id as string | undefined;
        const slot = await CalendarService.getTimeSlot(timeslotId, false);
        if (!slot) return res.status(404).json({ success: false, message: 'Time slot not found' });

        const parentCalendar = await CalendarService.getStaffCalendar({ id: slot.staffCalendarId }, false);
        if (parentCalendar && parentCalendar.userId === currentUserId) return next();

        return this.requirePermission(PERMISSIONS.TIMESLOT.VIEW)(req, res, next);
      } catch (err) {
        return next(err);
      }
    };
  }

}

export default new UserAuth();
