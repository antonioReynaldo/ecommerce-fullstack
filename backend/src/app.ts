import express from 'express';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import authRoutes from './modules/auth/auth.routes.js';
import employeesRoutes from './modules/employees/employees.routes.js';
import categoriesRoutes from './modules/categories/categories.routes.js';
import productsRoutes from './modules/products/products.routes.js';
import { errorMiddleware } from './middlewares/error.middleware.js';

const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/employees', employeesRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/products', productsRoutes);
app.use(errorMiddleware);

export default app;
