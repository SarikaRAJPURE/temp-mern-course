import { StatusCodes } from "http-status-codes";
import User from "../models/userModel.js";
import Job from "../models/jobModel.js";
import cloudinary from "cloudinary";
import { promises as fs } from "fs";

export const getCurrentUser = async (req, res) => {
  const user = await User.findOne({
    _id: req.user.userId,
  });
  const userWithoutPassword = user.toJSON();
  res
    .status(StatusCodes.OK)
    .json({ user: userWithoutPassword });
};

export const getApplicationStats = async (req, res) => {
  const users = await User.countDocuments();
  const jobs = await Job.countDocuments();

  res.status(StatusCodes.OK).json({ users, jobs });
  //.json({ msg: "get application status" });
};

export const updateUser = async (req, res) => {
  console.log(req.file);

  //to remove password from req.body
  const newUser = { ...req.body };
  delete newUser.password;
  //console.log(newUser);

  //access image file
  //multer gets all inside form data and converts it into req.body

  if (req.file) {
    const response = await cloudinary.v2.uploader.upload(
      req.file.path
    );
    //before we save file in db remove that file from public folder
    await fs.unlink(req.file.path);
    newUser.avatar = response.secure_url;//will use this to display image on frontend 
    newUser.avatarPublicId = response.public_id;// will use this to remove old image file
  }

  //updated user has old instance of user
  const updatedUser = await User.findByIdAndUpdate(
    req.user.userId,
    newUser
  );

  //if user updates image check if old img exists on cloudinary then remove it

  if (req.file && updatedUser.avatarPublicId) {
    await cloudinary.v2.uploader.destroy(
      updatedUser.avatarPublicId
    );
  }
  res.status(StatusCodes.OK).json({ msg: "update user" });
};
