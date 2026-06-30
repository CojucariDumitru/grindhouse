import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';

import { env, allowedOrigins } from './config/env';
import { apiLimiter } from './middleware/rateLimiter';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';

import menuRoutes from './routes/menu.routes';
import reservationRoutes from './routes/reservation.routes';
import contactRoutes from './routes/contact.routes';
import adminRoutes from './routes/admin.routes';

const app = express();

// Behind Render's proxy — needed for correct client IPs / rate limiting.
app.set('trust proxy', 1);

app.use(helmet());

app.use(
  cors({
    origin(origin, callback) {
      // allow non-browser tools (no origin), any whitelisted origin, and any
      // Vercel deployment (*.vercel.app) so preview/prod URLs work out of the box
      if (!origin || allowedOrigins.includes(origin) || /\.vercel\.app$/.test(origin)) {
        return callback(null, true);
      }
      return callback(new Error(`Origin ${origin} not allowed by CORS`));
    },
    credentials: true,
  }),
);

// Large limit so base64 menu images can be POSTed to the upload endpoint.
app.use(express.json({ limit: '12mb' }));
app.use(express.urlencoded({ extended: true }));

if (!env.isProd) {
  app.use(morgan('dev'));
}

app.use('/api', apiLimiter);

// Health check (used by Render's healthCheckPath).
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'grindhouse-api', time: new Date().toISOString() });
});

// Friendly root.
app.get('/', (_req, res) => {
  res.json({
    name: 'GRINDHOUSE API',
    tagline: 'No shortcuts. No apologies.',
    health: '/api/health',
  });
});

// Routes
app.use('/api/menu', menuRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/admin', adminRoutes);

// 404 + error handling (must be last)
app.use(notFoundHandler);
app.use(errorHandler);

const server = app.listen(env.port, () => {
  // eslint-disable-next-line no-console
  console.log(`🍔 GRINDHOUSE API running on port ${env.port} [${env.nodeEnv}]`);
});

// Graceful shutdown
const shutdown = (signal: string) => {
  // eslint-disable-next-line no-console
  console.log(`\n${signal} received — shutting down.`);
  server.close(() => process.exit(0));
};
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

export default app;
