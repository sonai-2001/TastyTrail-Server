import { asyncHandler } from "../../middleware/asyncHandler";
import { success } from "../../utils/responses";

export const getAllUsers= asyncHandler(async (req,res)=>{
    // Implement logic to get all users

    const users = [{ id: 1, name: 'John Doe' }, { id: 2, name: 'Jane Smith' }];
    return success(res, {
        data: users,
        message: 'All users fetched successfully',
        status: 200,
    });

})