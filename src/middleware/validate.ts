import ApiError from "../helpers/ApiError";
import { Request, Response, NextFunction } from "express";

const validate =
  (schema: any) => (req: Request, res: Response, next: NextFunction) => {
    const { value, error } = schema.validate(req.body);

    if (error) {
      const errorMessage = error.details
        .map((details: any) => details.message)
        .join(", ");
      return next(new ApiError(422, errorMessage));
    }
    Object.assign(req, value);

    return next();
  };

export default validate;
