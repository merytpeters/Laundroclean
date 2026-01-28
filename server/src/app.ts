// import cors from 'cors';
import express from 'express';
import { errorHandler } from './middlewares/errorHandler.js';
import { AuthRoutes } from './modules/auth/index.js';


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

app.use('/api/auth', AuthRoutes);
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
