import express from "express";
import {
  createJob,
  getJobs,
  getJob,
  updateJob,
  deleteJob,
  applyJob,
  getAppliedJobs,
} from "../controllers/job.controller.js";
import {
  jobValidator,
  jobUpdateValidator,
} from "../middleware/jobValidations.js";
import isLoggedIn from "../middleware/auth.js";

const jobRouter = express.Router();

jobRouter.post("/createJob", isLoggedIn, jobValidator, createJob);
jobRouter.get("/getJobs", isLoggedIn, getJobs);
jobRouter.get("/getJob/:id", isLoggedIn, getJob);
jobRouter.put("/updateJob/:id", isLoggedIn, jobUpdateValidator, updateJob);
jobRouter.delete("/delete/:id", isLoggedIn, deleteJob);
jobRouter.post("/apply/:id", isLoggedIn, applyJob);
jobRouter.get("/appliedJobs", isLoggedIn, getAppliedJobs);

export default jobRouter;
