import express from 'express';
import { register , login , getMe, logout } from '../controllers/authController.js';
import { isAutherized } from '../middleware/auth.js';

const router = express.Router();

router.post('/register' , register);
router.post('/login' , login);
router.post('/logout' , logout)

router.get('/me' , isAutherized , getMe);

export default router;