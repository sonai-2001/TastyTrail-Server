import {Router} from 'express';
import * as interestController from '../../controllers/admin/interestController';
import { requireAdmin, requireAuth } from '../../middleware/auth';
import { createUploader } from '../../middleware/upload';
import { multerErrorHandler } from '../../middleware/multerErrorhandler';

const router=Router();

// router.post('/create',requireAuth,requireAdmin,createUploader('interests','image'),multerErrorHandler,interestController.CreateInterests)
router.post("/getAll",requireAuth,requireAdmin,interestController.getAllInterests)
// router.patch("/update/:interestId",requireAuth,requireAdmin,createUploader('interests','image'),multerErrorHandler,interestController.updateInterests)
router.delete("/delete/:interestId",requireAuth,requireAdmin,interestController.deleteInterest)
router.patch('/statusUpdate/:interestId',requireAuth,requireAdmin,interestController.statusChange)
router.get("/getInterest/:interestId",requireAuth,requireAdmin,interestController.getInterest)


export default router;