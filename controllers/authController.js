import User from "../models/userModel.js";
import { StatusCodes } from "http-status-codes";
import {
  comparePassword,
  hashPassword,
} from "../utils/passwordUtils.js";
import { UnauthenticatedError } from "../errors/customErrors.js";
import { createJWT } from "../utils/tokenUtils.js";

//register
export const register = async (req, res) => {
  const isFirstAccount =
    (await User.countDocuments()) === 0;
  req.body.role = isFirstAccount ? "admin" : "user";

  const hashedPassword = await hashPassword(
    req.body.password
  );
  req.body.password = hashedPassword;

  const user = await User.create(req.body);
  res
    .status(StatusCodes.CREATED)
    .json({ msg: "user created" });
};

//login user
export const login = async (req, res) => {
  const user = await User.findOne({
    email: req.body.email,
  });
  const isValidUser =
    user &&
    (await comparePassword(
      req.body.password,
      user.password
    ));

  if (!isValidUser)
    throw new UnauthenticatedError("Invalid Credentials");

  const token = createJWT({
    userId: user._id,
    role: user.role,
  });

  //cookie expires in ms
  //1s=1000ms * 60sec(1min) * 60 mins(1hr)*24(1d)
  const oneDay = 1000 * 60 * 60 * 24;

  //create cookie
  res.cookie("token", token, {
    httpOnly: true, //cannot be accessed with JS in browser
    expires: new Date(Date.now() + oneDay), //in ms
    secure: process.env.NODE_ENV === "production", //cookie can be only transmitted over https but while we are developing its http
    //so to fix that set secure property to true when we are in prod env.if not m still will be able to access it using http
  });

  res
    .status(StatusCodes.OK)
    .json({ msg: "user logged in" });
  //res.json({ token });
  //res.send("login route");
};

//logout user
export const logout = (req, res) => {
  //remove cookie
  res.cookie("token", "logout", {
    httpOnly: true, //cannot be accessed with JS in browser
    expires: new Date(Date.now()), //expires immediately
  });
  res
    .status(StatusCodes.OK)
    .json({ msg: "user logged out!" });
};