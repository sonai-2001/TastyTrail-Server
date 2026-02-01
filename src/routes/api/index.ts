import { Router } from 'express';
import userRoutes from './user';
import  adminRoutes from './admin';

import authRoutes from './auth';
import outletRouter from './outlet';

const router = Router();

router.use('/user', userRoutes);
router.use('/admin', adminRoutes);
router.use("/auth",authRoutes);
router.use('/outlets', outletRouter);

export default router;
