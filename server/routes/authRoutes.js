import { Router } from 'express';
import { login, getCurrentUser, getUsers, createUser, updateUser } from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/requireRole.js';

const router = Router();

// Public auth routes
router.post('/login', login);

// Authenticated current user profile
router.get('/me', authenticate, getCurrentUser);

// Staff user management strictly restricted to System Administrator
router.get('/users', authenticate, requireRole(['admin']), getUsers);
router.post('/users', authenticate, requireRole(['admin']), createUser);
router.patch('/users/:id', authenticate, requireRole(['admin']), updateUser);

export default router;
