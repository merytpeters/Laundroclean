// import cors from 'cors';
import express from 'express';


const app = express();

{/*app.use(
    cors({
        origin: "",
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']
    })
)*/}

app.get('/', (req, res) => {
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
