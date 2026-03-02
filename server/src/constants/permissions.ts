export const PERMISSIONS = {
  USER: {
    VIEW: 'user:view',
    CREATE: 'user:create',
    UPDATE: 'user:update',
    DELETE: 'user:delete',
  },
  ROLE: {
    VIEW: 'role:view',
    CREATE: 'role:create',
    UPDATE: 'role:update',
    DELETE: 'role:delete',
  },
  BOOKING: {
    VIEW: 'booking:view',
    CREATE: 'booking:create',
    UPDATE: 'booking:update',
    DELETE: 'booking:delete',
  }
};

export const ALL_PERMISSIONS = Object.values(PERMISSIONS)
  .flatMap(resource => Object.values(resource));
