import { appEnv } from './env';

export const JWT_SECRET = appEnv.auth.jwtSecret;
export const IS_EPHEMERAL_JWT_SECRET = false;
