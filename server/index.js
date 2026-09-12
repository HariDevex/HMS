import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { getDbStatus } from './db/postgresClient.js';

// Import Route Handlers
import authRoutes from './routes/authRoutes.js';
import patientRoutes from './routes/patientRoutes.js';
import labRoutes from './routes/labRoutes.js';
import radiologyRoutes from './routes/radiologyRoutes.js';
import appointmentRoutes from './routes/appointmentRoutes.js';
import prescriptionRoutes from './routes/prescriptionRoutes.js';
import vitalsRoutes from './routes/vitalsRoutes.js';
import wardRoutes from './routes/wardRoutes.js';
import billingRoutes from './routes/billingRoutes.js';
import auditLogRoutes from './routes/auditLogRoutes.js';
import reportsRoutes from './routes/reportsRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Global Middleware
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request Logging Middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.originalUrl}`);
  next();
});

// Health & System Status Endpoint
app.get('/api/health', async (req, res) => {
  const dbStatus = await getDbStatus();
  res.json({
    status: 'healthy',
    system: 'Hospital Management System (HMS) — Express Backend',
    database: dbStatus,
    timestamp: new Date().toISOString(),
    endpoints: {
      auth: '/api/auth',
      patients: '/api/patients',
      labs: '/api/labs',
      radiology: '/api/radiology',
      appointments: '/api/appointments',
      prescriptions: '/api/prescriptions',
      vitals: '/api/vitals',
      wards: '/api/wards',
      billing: '/api/billing',
      auditLogs: '/api/audit-logs',
      reports: '/api/reports',
    },
  });
});

// API Root Information
app.get('/api', (req, res) => {
  res.json({
    name: 'HMS Clinical & Administrative REST API',
    version: '1.0.0',
    documentation: 'See server/README.md and server/db/schema.sql for PostgreSQL schema',
    health: '/api/health',
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/labs', labRoutes);
app.use('/api/radiology', radiologyRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/prescriptions', prescriptionRoutes);
app.use('/api/vitals', vitalsRoutes);
app.use('/api/wards', wardRoutes);
app.use('/api/billing', billingRoutes);
app.use('/api/audit-logs', auditLogRoutes);
app.use('/api/reports', reportsRoutes);

// 404 Catch-All Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Cannot ${req.method} ${req.originalUrl} — Route not found`,
  });
});

// Central Error Handler
app.use((err, req, res, _next) => {
  console.error('[Error Handler]', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
});

// Start Server
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, async () => {
    console.log('====================================================');
    console.log(`🏥 HMS Express Backend running on http://localhost:${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
    const status = await getDbStatus();
    console.log(`🗄️  Database engine: ${status.engine} (${status.status})`);
    console.log('====================================================');
  });
}

export default app;
