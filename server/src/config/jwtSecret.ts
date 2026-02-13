import crypto from 'crypto';
const MIN_SECRET_LENGTH = 20; 

const candidateSecrets = [
  process.env.JWT_SECRET,
  process.env.AUTH_SECRET,
  process.env.JWT_KEY
]
  .map((value) => (value || '').trim())
  .filter(Boolean);
const configuredSecret = candidateSecrets.find(
  (value) => value.length >= MIN_SECRET_LENGTH
);

if (!configuredSecret) {
  console.warn(
    '[SECURITY] JWT secret missing/too short. Using a temporary in-memory secret. ' +
    'Set JWT_SECRET in deployment env for stable authentication.'
  );
}

export const JWT_SECRET =
  configuredSecret || crypto.randomBytes(48).toString('base64url');

export const IS_EPHEMERAL_JWT_SECRET = !configuredSecret;