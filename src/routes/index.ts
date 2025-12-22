import { Router } from 'express';
import userRoutes from './user';
import adminRoutes from './admin';

import authRoutes from './admin/authRoutes';

const router = Router();

router.use('/user', userRoutes);
router.use('/admin', adminRoutes);
router.use("/auth",authRoutes)

export default router;
