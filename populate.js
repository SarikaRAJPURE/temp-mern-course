import { readFile } from "fs/promises";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

import Job from "./models/jobModel.js";
import User from "./models/userModel.js";

try {
  await mongoose.connect(process.env.MONGO_URL);
  const user = await User.findOne({
    email: "john@gmail.com",
  });
  // const user = await User.findOne({ email: "test@test.com" });

  //get jos from mock data file
  const jsonJobs = JSON.parse(
    await readFile(
      new URL("./utils/mockData.json", import.meta.url)
    )
  );
  const jobs = jsonJobs.map((job) => {
    return { ...job, createdBy: user._id };
  });
  //delete all existing jobs if there are any by this user
  await Job.deleteMany({ createdBy: user._id });

  //create jobs for test user
  await Job.create(jobs);
  console.log("Success!!!");
  process.exit(0);
} catch (error) {
  console.log(error);
  process.exit(1);
}
