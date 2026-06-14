import { Resend } from 'resend';
import { env } from './env';

/**
 * Resend client. If no API key is set (e.g. local dev without email),
 * `resend` is null and the email service degrades gracefully — it logs
 * the message instead of sending, so reservations still succeed.
 */
export const resend = env.resendApiKey ? new Resend(env.resendApiKey) : null;

export const emailConfigured = Boolean(env.resendApiKey);

export default resend;
