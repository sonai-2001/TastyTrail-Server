import Router from "express";
import { authenticate } from "../../../middleware/auth.middleware";
import { upload } from "../../../middleware/upload";
import { uploadController } from "../controller";

const uploadRoutes = Router()

uploadRoutes.post("/",authenticate,upload.single("image"),uploadController)
export default uploadRoutes
