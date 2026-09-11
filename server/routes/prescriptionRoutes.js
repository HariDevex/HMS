import { Router } from 'express';
import { getPrescriptions, createPrescription, updateAdministration } from '../controllers/prescriptionController.js';

const router = Router();
router.get('/', getPrescriptions);
router.post('/', createPrescription);
router.post('/:id/administer', updateAdministration);

export default router;
