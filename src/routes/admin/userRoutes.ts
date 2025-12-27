import { Router } from "express";

import { getAllUsers } from "../../controllers/admin/userController";
const router= Router();

router.get("/allUsers",getAllUsers )
export default router;