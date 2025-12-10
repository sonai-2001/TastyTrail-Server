import { Router } from 'express';
import authRoutes from './authRoutes';
import profileRoutes from './profileRoutes';
import interestsRoutes from './intersetsRoutes'

const router = Router();

router.use('/auth', authRoutes);
router.use('/profile', profileRoutes);
router.use('/interests', interestsRoutes);

export default router;
