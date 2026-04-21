import { Router } from 'express';
import { register, login, getMe, googleLogin, sendEmailOtp, verifyEmailOtp, updateRole } from '../controllers/authController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/google', googleLogin);
router.post('/send-email-otp', sendEmailOtp);
router.post('/verify-email-otp', verifyEmailOtp);
router.post('/update-role', updateRole);
router.get('/me', authMiddleware, getMe);

export default router;
