import { Router } from 'express';
import { getPatients, getPatientById, createPatient, updatePatient } from '../controllers/patientController.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/requireRole.js';

const router = Router();

// All patient endpoints require authentication
router.use(authenticate);

// Reads: all authenticated users
router.get('/', getPatients);
router.get('/:id', getPatientById);

// Writes: require doctor, nurse, admin (or reception for registration)
router.post('/', requireRole(['doctor', 'nurse', 'admin', 'reception']), createPatient);
router.patch('/:id', requireRole(['doctor', 'nurse', 'admin']), updatePatient);

export default router;
