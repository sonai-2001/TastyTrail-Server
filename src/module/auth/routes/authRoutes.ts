import { Router } from "express";
import { loginController, registerController, sendOtpController } from "../controller/authController";
import { validate } from "../../../middleware/validate.middleware";
import { loginSchema } from "../validationSchemas/login.validation";
import { registerSchema } from "../validationSchemas/register.validation";
import { sendOtpValidationSchema } from "../validationSchemas/sendOtpValidationSchema";

const routes = Router()

routes.post("/send-otp",validate(sendOtpValidationSchema), sendOtpController)
routes.post("/register",validate(registerSchema),registerController )
routes.post("/login", validate(loginSchema), loginController);

export default routes;