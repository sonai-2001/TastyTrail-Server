import { Request, Response } from "express";
import { asyncHandler } from "../../middleware/asyncHandler";
import { outletService } from "../../services/outlet/outlet.service";
import { success } from "../../utils/responses";


export const OnboardingController = {
 registerOutlet :asyncHandler(async (req: Request, res: Response) => {
  const outlet = await outletService.registerOutlet(req.user!.id, req.body);

  return success(res, { 
    data: outlet, 
    message: "Outlet registered successfully",
    status: 201 
  });
})

};
