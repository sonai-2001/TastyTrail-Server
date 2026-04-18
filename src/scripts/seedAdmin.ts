import "dotenv/config";
import mongoose from "mongoose";
import { User } from "../models/user.schema.";
import connectDB from "../config/db";

const seedAdmin = async () => {
  try {
    await connectDB(process.env.MONGO_URI!);
    console.log("Connected to database for seeding...");

    const adminEmail = "admin@tastytrial.com";
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (existingAdmin) {
      console.log("Admin already exists!");
      process.exit(0);
    }

    const admin = await User.create({
      name: "Super Admin",
      email: adminEmail,
      phone: "0000000000",
      password: "AdminPassword123!",
      roles: ["admin", "user"],
      isEmailVerified: true,
      isPhoneVerified: true
    });

    console.log("Admin created successfully:", admin.email);
    process.exit(0);
  } catch (error) {
    console.error("Error seeding admin:", error);
    process.exit(1);
  }
};

seedAdmin();
