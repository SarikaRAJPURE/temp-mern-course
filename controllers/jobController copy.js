import { nanoid } from "nanoid";

let jobs = [
  { id: nanoid(), company: "apple", position: "front-end" },
  { id: nanoid(), company: "google", position: "back-end" },
];

//GET all jobs
export const getAllJobs = async (req, res) => {
  if (jobs.length === 0) {
    res
      .status(404)
      .json({ msg: "Currently there are no jobs to show" });
  }
  res.status(200).json({ jobs });
};

//create a job

export const createJob = async (req, res) => {
  const { company, position } = req.body;
  if (!company || !position) {
    return res
      .status(400)
      .json({ msg: "please provide company and position" });
  }
  const id = nanoid(10);
  // console.log(id);
  const job = { id, company, position };
  jobs.push(job);
  res.status(201).json({ job });
};

//get a single job

export const getJob = async (req, res) => {
  const { id } = req.params;
  const job = jobs.find((job) => job.id === id);
  if (!job) {
    return res
      .status(404)
      .json({ msg: `no job with id ${id}` });
  }
  res.status(200).json({ job });
};

//Update job

export const updateJob = async (req, res) => {
  const { company, position } = req.body;
  if (!company) {
    return res.status(404).json({
      msg: "please provide company and position",
    });
  }
  const { id } = req.params;
  const job = jobs.find((job) => job.id === id);
  if (!job) {
    return res
      .status(404)
      .json({ msg: `no job with ${id}` });
  }
  job.company = company;
  job.position = position;
  res.status(200).json({ msg: `job modified`, job });
};

//delete job

export const deleteJob = async (req, res) => {
  const { id } = req.params;
  const job = jobs.find((job) => job.id === id);
  if (!job) {
    return res
      .status(404)
      .json({ msg: `no job with ${id}` });
  }
  const newjobs = jobs.filter((job) => job.id !== id);
  jobs = newjobs;
  res.status(200).json({ msg: `job deleted` });
};
