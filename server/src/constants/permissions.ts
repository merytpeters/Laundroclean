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
  SERVICE: {
    VIEW: 'service:view',
    CREATE: 'service:create',
    UPDATE: 'service:update',
    DELETE: 'service:delete',
  },
  SERVICEPRICE: {
    VIEW: 'serviceprice:view',
    CREATE: 'serviceprice:create', // used to create new + deactivate old
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
