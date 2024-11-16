import Jobs from "../models/Jobs.js";
import User from "../models/User.js";
import { errorResponse, successResponse } from "../utils/responses.js";
import logger from "../utils/logger.js";
import { StatusCodes } from "http-status-codes";

export const createJob = async (req, res, next) => {
  try {
    logger.info("START: Create Job Service");
    const { companyName, position, location, salary, description, status } =
      req.validatedJob;
	const userId = req.user.userId;
	// logger.info(req.user);

    const job = await Jobs.create({
      companyName,
      position,
      location,
      salary,
      description,
      status,
      user: userId,
    });

    logger.info("END: Create Job Service");
    return successResponse(
      res,
      StatusCodes.CREATED,
      "Job created successfully",
      {
        job,
      }
    );
  } catch (error) {
    logger.info(error);
    next(error);
  }
};

export const getJobs = async (req, res, next) => {
  try {
    logger.info("START: Get Jobs Service");
    const jobs = await Jobs.find({ user: req.user.userId });
    logger.info("END: Get Jobs Service");
    return successResponse(res, StatusCodes.OK, "Jobs retrieved successfully", {
      jobs,
    });
  } catch (error) {
    logger.error(error);
    next(error);
  }
};

export const getJob = async (req, res, next) => {
  try {
    logger.info("START: Get Job Service");
    const jobId = req.params.id;
    const userId = req.user.userId;

    const job = await Jobs.findById({_id: jobId, user: userId});
    if (!job) {
      return errorResponse(res, StatusCodes.NOT_FOUND, "Job not found");
    }
    logger.info("END: Get Job Service");
    return successResponse(res, StatusCodes.OK, "Job retrieved successfully", {
      job,
    });
  } catch (error) {
    logger.error(error);
    next(error);
  }
};

export const updateJob = async (req, res, next) => {
  try {
    logger.info("START: Update Job Service");
    const jobId = req.params.id;
    const userId = req.user.userId;
    const { companyName, position, location, salary, description, status } =
      req.validatedJob;

    const job = await Jobs.findOneAndUpdate(
      { _id: jobId, user: userId },
      {
        companyName,
        position,
        location,
        salary,
        description,
        status,
      },
      { new: true }
    );

    if (!job) {
      return errorResponse(res, StatusCodes.NOT_FOUND, "Job not found");
    }
    logger.info("END: Update Job Service");
    return successResponse(res, StatusCodes.OK, "Job updated successfully", {
      job,
    });
  } catch (error) {
    logger.error(error);
    next(error);
  }
};

export const deleteJob = async (req, res, next) => {
  try {
    logger.info("START: Delete Job Service");
    const jobId = req.params.id;
    const userId = req.user.userId;

    const job = await Jobs.findOneAndDelete({ _id: jobId, user: userId });

    if (!job) {
      return errorResponse(res, StatusCodes.NOT_FOUND, "Job not found");
    }
    logger.info("END: Delete Job Service");
    return successResponse(res, StatusCodes.OK, "Job deleted successfully");
  } catch (error) {
    logger.error(error);
    next(error);
  }
};

export const applyJob = async (req, res, next) => {
  try {
    logger.info("START: Apply Job Service");
    const jobId = req.params.id;
    const userId = req.user.userId;

    const job = await Jobs.findOneAndUpdate(
      { _id: jobId, user: userId },
      { appliedAt: new Date(), applied: true },
      { new: true }
    );

    if (!job) {
      return errorResponse(res, StatusCodes.NOT_FOUND, "Job not found");
    }

    const user = await User.findByIdAndUpdate(
      userId,
      {
        $addToSet: { appliedJobs: jobId },
      },
      { new: true }
    );
    logger.info("END: Apply Job Service");
    return successResponse(res, StatusCodes.OK, "Job applied successfully", {
      job,
    });
  } catch (error) {
    logger.error(error);
    next(error);
  }
};

export const getAppliedJobs = async (req, res, next) => {
  try {
    logger.info("START: Get Applied Jobs Service");
    const userId = req.user.userId;
    const status = req.query;

    const user = await User.findById(userId).populate({
      path: "appliedJobs",
      match: status ? { status } : {},
      select: " companyName position location salary description status",
    });
    if (!user) {
      return errorResponse(res, StatusCodes.NOT_FOUND, "User not found");
    }
	logger.info("END: Get Applied Jobs Service");
	return successResponse(
	  res,
	  StatusCodes.OK,
	  "Applied jobs retrieved successfully",
	  {
		jobs: user.appliedJobs,
	  }
	);
  } catch (error) {
    logger.error(error);
    next(error);
  }
};
