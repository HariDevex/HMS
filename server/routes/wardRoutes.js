import { Router } from 'express';
import { getWards, getBeds, assignBed, updateBedStatus } from '../controllers/wardController.js';

const router = Router();
router.get('/', getWards);
router.get('/beds', getBeds);
router.post('/beds/:bedId/assign', assignBed);
router.patch('/beds/:bedId/status', updateBedStatus);

export default router;
