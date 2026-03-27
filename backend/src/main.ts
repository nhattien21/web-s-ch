import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import authRouter from './routes/auth';
import productsRouter from './routes/products';
import cartRouter from './routes/cart';
import ordersRouter from './routes/orders';

// Load environment variables
dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB()
  .then(() => {
    console.log('[DB] Connected');
  })
  .catch((err) => {
    console.error('[DB] Connection error', err);
    process.exit(1);
  });

app.use('/api/auth', authRouter);
app.use('/api/products', productsRouter);
app.use('/api/cart', cartRouter);
app.use('/api/orders', ordersRouter);

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response): void => {
  res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Welcome endpoint
app.get('/api', (_req: Request, res: Response): void => {
  res.status(200).json({ message: 'E-Commerce API v1.0', version: '1.0.0' });
});

// 404 handler
app.use((_req: Request, res: Response): void => {
  res.status(404).json({ error: 'Not Found', message: 'Endpoint does not exist' });
});

// Error handler
app.use(
  (
    err: { status?: number; message?: string },
    _req: Request,
    res: Response,
    _next: unknown
  ): void => {
    console.error('Error:', err);
    res.status(err.status || 500).json({
      error: err.message || 'Internal Server Error',
      status: err.status || 500,
    });
  }
);

// Start server
app.listen(PORT, (): void => {
  console.log(`[Server] Running on http://localhost:${PORT}`);
  console.log(`[Server] Environment: ${process.env.NODE_ENV || 'development'}`);
});

export default app;
