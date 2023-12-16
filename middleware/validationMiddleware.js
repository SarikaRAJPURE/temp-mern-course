import {
  body,
  param,
  validationResult,
} from "express-validator";
import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} from "../errors/customErrors.js";
import {
  JOB_STATUS,
  JOB_TYPE,
} from "../utils/constants.js";
import mongoose from "mongoose";
import Job from "../models/jobModel.js";
import User from "../models/userModel.js";
//function that returns errors array
const withValidationErrors = (validateValues) => {
  return [
    validateValues,
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const errorMessages = errors
          .array()
          .map((error) => error.msg);
        if (errorMessages[0].startsWith("no job")) {
          throw new NotFoundError(errorMessages);
        }
        if (errorMessages[0].startsWith("not authorized")) {
          throw new UnauthorizedError(
            "not authorized to access this route"
          );
        }
        throw new BadRequestError(errorMessages);
      }
      next();
    },
  ]; //to grp multiple middlewares use array
};

export const validateJobInput = withValidationErrors([
  body("company")
    .notEmpty()
    .withMessage("company is required"),
  body("position")
    .notEmpty()
    .withMessage("position is required"),
  body("jobLocation")
    .notEmpty()
    .withMessage("job location is required"),
  body("jobStatus")
    .isIn(Object.values(JOB_STATUS))
    .withMessage("invalid Status value"),
  body("jobType")
    .isIn(Object.values(JOB_TYPE))
    .withMessage("invalid type value"),
]);

export const validateIdParam = withValidationErrors([
  param("id").custom(async (value, { req }) => {
    const isValidId =
      mongoose.Types.ObjectId.isValid(value);
    if (!isValidId) throw new Error("invalid MongoDB id");
    const job = await Job.findById(value);
    if (!job)
      throw new NotFoundError(`no job with id ${value}`);
    //console.log(req);
    //console.log(job);
    const isAdmin = req.user.role === "admin";
    const isOwner =
      req.user.userId === job.createdBy.toString();
    if (!isAdmin && !isOwner)
      throw new UnauthorizedError(
        "not authorized to access this route"
      );
  }),
  //.withMessage("invalid MongoDB id"),
]);

/* export const validateTest = withValidationErrors([
  body("name")
    .isEmpty()
    .withMessage("name is required")
    .isLength({ min: 3, max: 50 })
    .withMessage(
      "name must be between 3 and 50 characters long"
    )
    .trim(),
]); */

//validate User
export const validateRegisterInput = withValidationErrors([
  body("name").notEmpty().withMessage("name is required"),
  body("email")
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("Invalid email format")
    .custom(async (email) => {
      const user = await User.findOne({ email });
      if (user)
        throw new BadRequestError("email already exists");
    }),
  body("password")
    .notEmpty()
    .withMessage("password is required")
    .isLength({ min: 8 })
    .withMessage(
      "password must be at least 8 characters long"
    ),
  body("location")
    .notEmpty()
    .withMessage("location is required"),
  body("lastName")
    .notEmpty()
    .withMessage("last name is required"),
]);

//validate Login inputs
export const validateLoginInput = withValidationErrors([
  body("email")
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("Invalid email format"),
  body("password")
    .notEmpty()
    .withMessage("password is required"),
]);

export const validateUpdateUserInput = withValidationErrors(
  [
    body("name").notEmpty().withMessage("name is required"),
    body("email")
      .notEmpty()
      .withMessage("email is required")
      .isEmail()
      .withMessage("invalid email format")
      .custom(async (email, { req }) => {
        const user = await User.findOne({ email });
        if (
          user &&
          user._id.toString() !== req.user.userId //to check email is not used by any other user
        ) {
          throw new Error("email already exists");
        }
      }),
    body("lastName")
      .notEmpty()
      .withMessage("last name is required"),
    body("location")
      .notEmpty()
      .withMessage("location is required"),
  ]
);
