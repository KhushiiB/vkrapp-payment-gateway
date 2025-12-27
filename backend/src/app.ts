import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import paymentRoutes from './routes/payment.routes';
import errorResponse from './utils/ErrorResponse';
import notFound from './utils/NotFound';

dotenv.config();

const app: Express = express();

app.use(express.json());

app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'ok' });
});

app.use('/api/v1/payments', paymentRoutes);

app.use(errorResponse);
app.use(notFound);



(app as any).on('error', (error: Error, ctx: { req: Request }) => {
  console.error('Application Error:', {
    message: error.message,
    url: ctx?.req?.url,
    headers: ctx?.req?.headers,
    stack: error.stack,
  });
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Promise Rejection:', { reason, promise });
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

export default app;
