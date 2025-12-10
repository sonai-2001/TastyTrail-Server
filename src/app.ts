import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import routes from './routes';
import notFound from './middleware/notFound';
import { errorHandler } from './middleware/errorHandler';
import logger from './config/logger';
import cookieParser from 'cookie-parser';
import path from 'path';

const app = express();

// Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(path.resolve('uploads')));



if (process.env.NODE_ENV !== 'test') {
  app.use(
    morgan('combined', { stream: { write: (msg: string) => logger.info(msg.trim()) } })
  );
}

app.use(rateLimit({ windowMs: 60000, max: 100 }));

// Routes
app.get('/health', (_req, res) => res.json({ status: 'ok' }));
app.use('/api', routes);

// Error handling
app.use(notFound);
app.use(errorHandler);

export default app;
