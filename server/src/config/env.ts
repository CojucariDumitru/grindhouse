import dotenv from 'dotenv';

dotenv.config();

/**
 * Centralised, type-safe access to environment variables.
 * Throws early (on boot) if a required variable is missing so we
 * never get a confusing runtime failure deep inside a request.
 */
function required(key: string): string {
  const value = process.env[key];
  if (!value || value.trim() === '') {
    throw new Error(`[env] Missing required environment variable: ${key}`);
  }
  return value;
}

function optional(key: string, fallback: string): string {
  const value = process.env[key];
  return value && value.trim() !== '' ? value : fallback;
}

export const env = {
  nodeEnv: optional('NODE_ENV', 'development'),
  isProd: optional('NODE_ENV', 'development') === 'production',
  port: parseInt(optional('PORT', '5000'), 10),

  databaseUrl: required('DATABASE_URL'),

  jwtSecret: required('JWT_SECRET'),
  jwtExpiresIn: optional('JWT_EXPIRES_IN', '7d'),

  resendApiKey: optional('RESEND_API_KEY', ''),
  emailFrom: optional('EMAIL_FROM', 'reservations@grindhouse.com'),
  restaurantEmail: optional('RESTAURANT_EMAIL', 'admin@grindhouse.com'),

  cloudinary: {
    cloudName: optional('CLOUDINARY_CLOUD_NAME', ''),
    apiKey: optional('CLOUDINARY_API_KEY', ''),
    apiSecret: optional('CLOUDINARY_API_SECRET', ''),
  },

  // Comma-separated list of allowed origins is supported.
  clientUrl: optional('CLIENT_URL', 'http://localhost:5173'),

  adminEmail: optional('ADMIN_EMAIL', 'admin@grindhouse.com'),
  adminPassword: optional('ADMIN_PASSWORD', 'Grind2024!'),
};

// Origins always allowed in addition to CLIENT_URL, so the deployed
// frontends work regardless of how CLIENT_URL is configured.
const DEFAULT_ORIGINS = [
  'https://grindhouse.vercel.app',
  'https://cojucaridumitru.github.io',
];

export const allowedOrigins = Array.from(
  new Set([
    ...env.clientUrl.split(',').map((o) => o.trim()).filter(Boolean),
    ...DEFAULT_ORIGINS,
  ]),
);
