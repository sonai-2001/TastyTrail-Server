import { Router } from 'express';
import authRoutes from './authRoutes';
import profileRoutes from './profileRoutes';
import frinedRoutes from "./friendRoutes"
const router = Router();

router.use('/auth', authRoutes);
router.use('/profile', profileRoutes);
router.use("/friend",frinedRoutes)


export default router;
