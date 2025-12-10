import {Request, Response, Router} from "express"
import { requireAuth } from "../../middleware/auth"
import * as friendController from "../../controllers/user/friendController"


const router=Router()

 router.post("/request/send/:recieverId",requireAuth,friendController.sendFriendRequest)
 router.post("/request/accept/:requestId",requireAuth,friendController.acceptFriendRequest)
 router.post("/request/reject/:requestId",requireAuth,friendController.rejectFriendRequest)
 router.post("/suggetions",requireAuth,friendController.getSuggestions)






export default  router
