import { Router } from 'express';
import { login, register, resendOtp, verifyOtp } from '../../../controllers/auth/auth.controller';

const router = Router();

router.post('/login', login);

router.post('/register', register);

router.post('/verifyOtp', verifyOtp);
router.post('/resendOtp', resendOtp);

export default router;