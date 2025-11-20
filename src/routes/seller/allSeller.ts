import { Router } from "express";
import { sendSuccess } from "../../utils/successResponse";

const router = Router();

router.get("/", (req, res) => {
  sendSuccess(res);
});
export default router;