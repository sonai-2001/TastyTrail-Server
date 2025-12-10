import { Response, Request } from "express";
import { asyncHandler } from "../../middleware/asyncHandler";
import { error, success } from "../../utils/responses";
import User from "../../models/User"
import { FriendModel } from "../../models/Friend";
import { friendStatus, statusEnum } from "../../common/commonEnum";
import interests from "../../models/interests";
import { paginate } from "../../services/shared/paginatedService";

export const sendFriendRequest=asyncHandler(async(req:Request,res:Response)=>{
       console.log("🚀 ~ req:", req.user)
       console.log('check called');
       const recieverId=req.params.recieverId
          if(!req?.user?.id){
         return  error(res,{
            message:'sender id  is not available',
            status:400

            })
       }
       const senderId=req?.user?.id

   
    
       if(!recieverId){
        return error(res,{
            message:'reciever id is not present',
            status:400
        })
       }

        if(senderId === recieverId){
        return error(
            res,{
                message:'sender can not send request to himself',
                status:400
            }
        )
       }
       
       const sender =await  User.findById(senderId)

       if(!sender || sender.status==statusEnum.INACTIVE){
               return error(res,{
                message:'sender either not available or inactive',
                status:400
               })
       }

       const reciever=await  User.findById(recieverId)

       if(!reciever || reciever.status===statusEnum.INACTIVE){
        return error(res,{
            message:'reciever is either not present or inactive',
            status:400
        })
       }

       const friendRequest= await FriendModel.findOne({
        $or:[
            { sender:senderId,reciver:recieverId},
            {sender:recieverId,reciver:senderId}
        ]
       })

       if(friendRequest && friendRequest.status===friendStatus.ACCEPTED){
           return error(res,{
            message:'friend request already accepted ',
            status:400
           })
       }else if(friendRequest && friendRequest.status===friendStatus.PENDING){
           return error (res,{
            message:'friend request already pending',
            status:400
           })
       }else if(friendRequest && friendRequest.status===friendStatus.REJECTED){
         return error (res,{
            message:'friend request already rejected',
            status:400
           })
       }

     const newFriendRelation= await FriendModel.create({
        sender:senderId,
        reciver:recieverId,
        status:friendStatus.PENDING
       })

     return success(res,{
        message:`friend request sent to ${reciever.name}`,
        status:201,
        data:newFriendRelation
     })
       

   



       
       res.send('hi')
})

export const acceptFriendRequest=asyncHandler(async(req:Request,res:Response)=>{
      const recieverId= req?.user?.id
      const requestId=req.params.requestId

      if(!recieverId){
        return error(res,{
            message:'reciever id is not present',
            status:400
        })
      }

        if(!requestId){
        return error(res,{
            message:'request id is not present',
            status:400
        })
      }
      
    const request= await FriendModel.findById(requestId)
    if (!request) {
        return error(res,{
             message:'request is not found',
             status:400
        })
    }
    if(request.status !== friendStatus.PENDING){
        return error (res,{
            message:'request is not in pending state',
            status:400
        })
    }

    if(recieverId!=request.reciver){
         return error(res,{
            message:'only the reciever can accept the friend request',
            status:400
         })
    }

    const senderId=request.sender
   const senderUser= await User.findById(senderId)
   console.log("🚀 ~ senderUser:", senderUser)

   if(!senderUser || senderUser.status === statusEnum.INACTIVE){
       return error(res,{
        message:'sender is not valid or inactive',
        status:400
       })
   }

   request.status=friendStatus.ACCEPTED
  const friendCurrentRequestStatus= await request.save()

  return success(res,{
    message:`Friend request accepted for ${senderUser.name}`,
    status:201,
    data:friendCurrentRequestStatus
  })



})

export const rejectFriendRequest=asyncHandler(async(req:Request,res:Response)=>{
      const recieverId= req?.user?.id
      const requestId=req.params.requestId

      if(!recieverId){
        return error(res,{
            message:'reciever id is not present',
            status:400
        })
      }

        if(!requestId){
        return error(res,{
            message:'request id is not present',
            status:400
        })
      }
      
    const request= await FriendModel.findById(requestId)
    if (!request) {
        return error(res,{
             message:'request is not found',
             status:400
        })
    }
    if(request.status !== friendStatus.PENDING){
        return error (res,{
            message:'request is not in pending state',
            status:400
        })
    }

    if(recieverId!=request.reciver){
         return error(res,{
            message:'only the reciever can accept the friend request',
            status:400
         })
    }

    const senderId=request.sender
   const senderUser= await User.findById(senderId)
   console.log("🚀 ~ senderUser:", senderUser)

   if(!senderUser || senderUser.status === statusEnum.INACTIVE){
       return error(res,{
        message:'sender is not valid or inactive',
        status:400
       })
   }

   request.status=friendStatus.REJECTED
  const friendCurrentRequestStatus= await request.save()

  return success(res,{
    message:`Friend request rejected for ${senderUser.name}`,
    status:201,
    data:friendCurrentRequestStatus
  })



})

export const getSuggestions =asyncHandler(async(req:Request,res:Response)=>{
   const userId=req?.user?.id

   const { page=1, limit=10}=req.body

 const currentUserInterests= await User.findById(userId).select('interests')

 const existingFrineds=await FriendModel.find({
  $or:[
    {sender:userId},
    {reciver:userId}
  ]
 })

 const existingUserIds= new Set()
  existingUserIds.add(userId)
  existingFrineds.forEach(friend=>{
    existingUserIds.add(friend.sender)
    existingUserIds.add(friend.reciver)
  })

 const pipeline=[
  {
   $match:{
      status:statusEnum.ACTIVE,
      _id:{
        $nin:Array.from(existingUserIds)
      },
      interests:{
        $in:currentUserInterests?.interests
      }
   }
  },
  {
     $addFields:{
      sharedInterests:{
        $size:{
          $setIntersection:[
            "$interests",
            currentUserInterests?.interests
          ]
        }
      }
     }
  },
   {$sort:{sharedInterests:-1}},
   {
    $project:{
     _id:0,
     name:1,
     interests:1,
     sharedInterests:1,
     profilePicture:1,


    }
   }

 ]

let suggestions =await paginate( {
  model: User,
    page,
    limit,
    sort: { sharedInterestCount: -1 },
    pipeline,
})


if (suggestions.data.length === 0) {
    suggestions = await paginate({
      model: User,
      page,
      limit,
      filter: {
        _id: { $nin: [...existingUserIds] },
        status: statusEnum.ACTIVE,
      },
      sort: { createdAt: -1 },
    });
  }
 return success(res,{
  message:'suggestions fetched',
  status:200, 
  data:suggestions
})

})







