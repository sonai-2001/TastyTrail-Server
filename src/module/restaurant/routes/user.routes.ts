import { Router } from "express";
import { authenticate } from "../../../middleware/auth.middleware";
import * as userController from "../controller/user.controller";

const router = Router();

router.get("/", userController.getAllRestaurantsList);
router.get("/:id", userController.getSingleRestaurantDetail);

export default router;
