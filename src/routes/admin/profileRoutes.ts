import { Router } from 'express';
import * as profileController from '../../controllers/admin/profileController';
import { requireAdmin, requireAuth } from '../../middleware/auth';


const router = Router();

router.get('/getProfile', requireAuth, requireAdmin, profileController.getProfile);
export default router;
