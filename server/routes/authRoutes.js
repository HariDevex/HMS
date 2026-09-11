import { Router } from 'express';
import { login, getCurrentUser, getUsers, createUser, updateUser } from '../controllers/authController.js';

const router = Router();
router.post('/login', login);
router.get('/me', getCurrentUser);
router.get('/users', getUsers);
router.post('/users', createUser);
router.patch('/users/:id', updateUser);

export default router;
