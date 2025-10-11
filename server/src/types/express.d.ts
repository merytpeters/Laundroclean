import 'express-session';
import type { SessionPayload } from './index.ts';

declare module 'express-serve-static-core' {
  interface Request {
    user?: SessionPayload
  }
}

declare module 'express-session' {
  interface SessionData {
    user?: SessionPayload
  }
}