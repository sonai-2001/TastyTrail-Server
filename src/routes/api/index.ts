import { Router } from 'express';
import userRoutes from './user';
import  adminRoutes from './admin';

import authRoutes from './auth';
const router = Router();

router.use('/user', userRoutes);
// router.use('/restaurant_owner', authRoutes);
router.use('/admin', adminRoutes);
router.use("/auth",authRoutes)

export default router;
