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
    UPDATESTATUS: 'bookingstatus:update',
    DELETE: 'booking:delete',
  },
  DROPOFF: {
    CREATE: 'dropoff:create',
    UPDATE: 'dropoff:update',
    DELETE: 'dropoff:delete',
    ACTIVATE: 'dropoff:makeactive',
  },
  SERVICEAREA: {
    CREATE: 'servicearea:create',
    UPDATE: 'servicearea:update',
    DELETE: 'servicearea:delete',
    ACTIVATE: 'servicearea:makeactive',
  },
};

export const ALL_PERMISSIONS = Object.values(PERMISSIONS)
  .flatMap(resource => Object.values(resource));
