import { Router } from 'express';
import { login, register, resendOtp, verifyOtp } from '../../../controllers/auth/auth.controller';
import { validate } from '../../../middleware/validate.middleware';
import { registerSchema } from '../../../validations/auth/register';

const router = Router();

router.post('/login', login);

router.post('/register',validate(registerSchema), register);

router.post('/verifyOtp', verifyOtp);
router.post('/resendOtp', resendOtp);

export default router;