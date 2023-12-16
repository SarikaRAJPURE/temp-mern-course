import Job from "../models/jobModel.js";
import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";
import day from "dayjs";

//GET all jobs
export const getAllJobs = async (req, res) => {
  //console.log(req);
  //console.log(req.user);

  const { search, jobStatus, jobType, sort } = req.query;

  const queryObject = {
    createdBy: req.user.userId,
  };
  //if search exists then add it to query object
  if (search) {
    //queryObject.position =req.query.search;

    queryObject.$or = [
      { position: { $regex: search, $options: "i" } },
      { company: { $regex: search, $options: "i" } },
    ];
  }
  //search based on job type and job status
  if (jobStatus && jobStatus !== "all") {
    queryObject.jobStatus = jobStatus;
  }
  if (jobType && jobType !== "all") {
    queryObject.jobType = jobType;
  }
  //sorting
  const sortOptions = {
    newest: "-createdAt",
    oldest: "createdAt",
    "a-z": "position",
    "z-a": "-position",
  };
  const sortKey = sortOptions[sort] || sortOptions.newest;

  // setup pagination
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const jobs = await Job.find(queryObject)
    .sort(sortKey)
    .skip(skip)
    .limit(limit);
  /* console.log(req.query);
  const jobs = await Job.find({
    createdBy: req.user.userId,
    position: req.query.search,
  }); */

  /* if (jobs.length === 0) {
    res
      .status(404)
      .json({ msg: "Currently there are no jobs to show" });
  } */
  const totalJobs = await Job.countDocuments(queryObject);
  const numOfPages = Math.ceil(totalJobs / limit);

  res.status(StatusCodes.OK).json({
    totalJobs,
    numOfPages,
    currentPage: page,
    jobs,
  });
};

//create a job

export const createJob = async (req, res) => {
  //const { company, position } = req.body;
  req.body.createdBy = req.user.userId;
  const job = await Job.create(req.body);
  res.status(StatusCodes.CREATED).json({ job });
};

//get a single job

export const getJob = async (req, res) => {
  const job = await Job.findById(req.params.id);
  res.status(StatusCodes.OK).json({ job });
};

//Update job

export const updateJob = async (req, res) => {
  const updatedJob = await Job.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
    }
  );
  res
    .status(StatusCodes.OK)
    .json({ msg: `job modified`, job: updatedJob });
};

//show stats

export const showStats = async (req, res) => {
  let stats = await Job.aggregate([
    {
      $match: {
        createdBy: new mongoose.Types.ObjectId(
          req.user.userId
        ),
      },
    },
    { $group: { _id: "$jobStatus", count: { $sum: 1 } } },
  ]);
  console.log(stats);
  stats = stats.reduce((acc, curr) => {
    const { _id: title, count } = curr;
    acc[title] = count;
    return acc;
  }, {});
  console.log(stats);

  const defaultStats = {
    pending: stats.pending || 0,
    interview: stats.interview || 0,
    declined: stats.declined || 0,
  };

  let monthlyApplications = await Job.aggregate([
    {
      $match: {
        createdBy: new mongoose.Types.ObjectId(
          req.user.userId
        ),
      },
    },
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
        },
        count: { $sum: 1 },
      },
    },
    { $sort: { "_id.year": -1, "_id.month": -1 } },
    { $limit: 6 },
  ]);
  console.log(monthlyApplications);
  monthlyApplications = monthlyApplications
    .map((item) => {
      const {
        _id: { year, month },
        count,
      } = item;

      const date = day()
        .month(month - 1)
        .year(year)
        .format("MMM YY");
      return { date, count };
    })
    .reverse();

  res
    .status(StatusCodes.OK)
    .json({ defaultStats, monthlyApplications });
  //res.send("stats");
};

//delete job

export const deleteJob = async (req, res) => {
  const removeJob = await Job.findByIdAndDelete(
    req.params.id
  );
  res
    .status(StatusCodes.OK)
    .json({ msg: `job deleted `, job: removeJob });
};
