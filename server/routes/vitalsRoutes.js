import { Router } from 'express';
import { getPatientVitals, recordVitals } from '../controllers/vitalsController.js';

const router = Router();
router.get('/:patientId', getPatientVitals);
router.post('/:patientId', recordVitals);

export default router;
