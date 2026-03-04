// import cors from 'cors';
import express from 'express';
import path from 'path';
import nunjucks from 'nunjucks';
import config from './config/config.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { AuthRoutes } from './modules/auth/index.js';
import { AdminRoutes, RolesRoutes, AdminUsersRoutes, AdminServiceRoutes } from './modules/admin/index.js';
import { EmailRoutes } from './modules/emailService/index.js';
import { ProfileRoutes } from './modules/common/index.js';
import { LaundrocleanservicesRoutes } from './modules/laundrocleanservices/index.js';
import { StaffServiceRoutes } from './modules/staff/index.js';
import { ClientServiceRoutes } from './modules/clientuser/index.js';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './config/swagger.js';


const app = express();

const templatesPath = config.TEMPLATES_PATH;


nunjucks.configure(templatesPath, {
  autoescape: true,
  express: app,
});

app.set('view engine', 'html');
// parse JSON bodies
app.use(express.json());

{/*app.use(
  cors({
    origin: "",
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']
  })
)
*/}

{/* EmailRoutes and static css for test purpose */}
app.use(express.static(path.join(templatesPath, 'styles')));
app.use('/templates', EmailRoutes);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.set('view engine', 'html');

app.use('/api/v1/auth', AuthRoutes);
// important that AdminServiceRoutes comes before StaffServiceRoutes if not express does not hit all routes
app.use('/api/v1/admin', AdminRoutes, RolesRoutes, AdminUsersRoutes, AdminServiceRoutes, StaffServiceRoutes);
app.use('/api/v1/profile', ProfileRoutes);
app.use('/api/v1/services', LaundrocleanservicesRoutes);
app.use('/api/v1/staff', StaffServiceRoutes);
app.use('/api/v1/client', ClientServiceRoutes);

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
