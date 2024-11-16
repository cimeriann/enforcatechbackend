import { z } from "zod";
import { StatusCodes } from "http-status-codes";
import { errorResponse } from "../utils/responses.js";

const jobSchema = z.object({
  companyName: z
    .string({
      required_error: "Please provide a company name",
      invalid_type_error: "companyName must be a string",
    })
    .min(3, { message: "companyName must be at least 3 Characters long" })
    .max(50, { message: "companyName must not be longer than 50 characters" })
    .trim(),

  position: z
    .string({
      required_error: "Please provide a job title",
      invalid_type_error: "position must be a string",
    })
    .trim(),

  location: z
    .string({
      required_error: "Please provide a location",
      invalid_type_error: "location must be a string",
    })
    .trim(),

  salary: z.number().optional(),

  description: z.string().optional(),

  postedAt: z.date().optional(),

  appliedAt: z.date().optional(),

  applied: z.boolean().optional(),

  status: z.enum(["pending", "interview", "rejected", "accepted"], {
    required_error: "Status is required",
    invalid_type_error:
      "Status must be either 'pending', 'interview', 'rejected' or 'accepted'",
  }),

  user: z.string().optional(),
});

const jobUpdateSchema = z.object({
  companyName: z.string().optional(),
  position: z.string().optional(),
  location: z.string().optional(),
  salary: z.number().optional(),
  description: z.string().optional(),
  status: z.enum(["pending", "interview", "rejected", "accepted"]).optional(),
  user: z.string().optional(),
});

export const jobUpdateValidator = async (req, res, next) => {
  try {
    const jobUpdateData = jobUpdateSchema.parse(req.body);

    if (!jobUpdateData) {
      const validationErrors = jobUpdateSchema.errors.error.map((err) => ({
        field: err.path[0],
        message: err.message,
      }));
      errorResponse(res, StatusCodes.BAD_REQUEST, {
        message: "Validation Error",
        errors: validationErrors,
      });
    }
    req.validatedJob = jobUpdateData;
    next();
  } catch (error) {
    next(error);
  }
};
export const jobValidator = async (req, res, next) => {
  try {
    const jobData = jobSchema.parse(req.body);
    jobData.user = req.user.id;
    if (!jobData) {
      const validationErrors = jobSchema.errors.error.map((err) => ({
        field: err.path[0],
        message: err.message,
      }));
      errorResponse(res, StatusCodes.BAD_REQUEST, {
        message: "Validation Error",
        errors: validationErrors,
      });
    }
    req.validatedJob = jobData;
    next();
  } catch (error) {
    errorResponse(res, StatusCodes.BAD_REQUEST, error.errors);
    next(error);
  }
};
