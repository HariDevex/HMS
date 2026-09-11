import { Router } from 'express';
import { getPatients, getPatientById, createPatient, updatePatient } from '../controllers/patientController.js';

const router = Router();
router.get('/', getPatients);
router.get('/:id', getPatientById);
router.post('/', createPatient);
router.patch('/:id', updatePatient);

export default router;
