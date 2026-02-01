import mongoose, { Types } from "mongoose";
import { Outlet } from "../../models/outlet";
import { CreateOutletDTO } from "../../dtos/outlet.dto";
import { BankAccount } from "../../models/bank-account";
import { ApiError } from "../../utils/ApiError";

const generateOutletCode = () => {
  const chars = "ABCDEFGHJKMNPQRSTUVWXYZ123456789";
  let result = "";
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `#${result}`;
};

export const outletService = {
  registerOutlet: async (ownerId: Types.ObjectId, data: CreateOutletDTO) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const { bankDetails, ...outletData } = data;

      let outletCode = "";
      let isUnique = false;

      while (!isUnique) {
        outletCode = generateOutletCode();
        const existingOutlet = await Outlet.findOne({ outletCode }).session(session);
        if (!existingOutlet) {
          isUnique = true;
        }
      }

      const lng = parseFloat(data.location.coordinates[0] as any);
      const lat = parseFloat(data.location.coordinates[1] as any);

      if (isNaN(lng) || isNaN(lat)) {
        throw new ApiError("Invalid coordinates provided", 400);
      }

      const [newOutlet] = await Outlet.create(
        [
          {
            ...outletData,
            ownerId,
            code: outletCode,
            location: {
              type: "Point",
              coordinates: [lng, lat],
            },
            onboardingStatus: "PENDING",
          },
        ],
        { session },
      );

      //Create Bank Account using bankDetails
      await BankAccount.create(
        [
          {
            ...bankDetails,
            outletId: newOutlet._id,
            ownerId,
          },
        ],
        { session },
      );

      await session.commitTransaction();
      return newOutlet;
    } catch (error: any) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  },
};
