import { Router } from "express";
import allSeller from "./allSeller";

const router=Router();

router.use("/allSeller",allSeller)

export default router;