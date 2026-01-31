// import cors from 'cors';
import express from 'express';
import { errorHandler } from './middlewares/errorHandler.js';
import { AuthRoutes } from './modules/auth/index.js';
import { AdminRoutes } from './modules/admin/index.js';


const app = express();

// parse JSON bodies
app.use(express.json());

{/*app.use(
  cors({
    origin: "",
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']
  })
)
*/}

app.use('/api/v1/auth', AuthRoutes);
app.use('/api/v1/admin', AdminRoutes);
app.use(errorHandler);

app.get('/api', (req, res) => {
    res.json({ message: 'LaundroClean is running' });
});

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

export default app;
