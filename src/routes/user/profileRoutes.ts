import { Router } from 'express';
import * as profileController from '../../controllers/user/profileController';
import { requireAuth } from '../../middleware/auth';
import { createUploader } from '../../middleware/upload';
import { multerErrorHandler } from '../../middleware/multerErrorhandler';
import * as interestController from "../../controllers/admin/interestController"

const router = Router();

router.get('/getProfile', requireAuth, profileController.getProfile);
router.patch('/updateProfile', requireAuth,createUploader('users','profilePicture'),multerErrorHandler,  profileController.updateProfile);

router.patch('/setInterests', requireAuth, profileController.setInterests);
router.patch('/changePassword', requireAuth, profileController.changePassword);

router.post("/interest/getAll",requireAuth,interestController.getAllInterests)


export default router;
