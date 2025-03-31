import { NextFunction, Request, Response } from "express";
import { AsyncValidationOptions, ObjectSchema } from "joi";

// interfaces
import { StatusCodeEnums } from "../interfaces/enums";

// utils
import { failure } from "../utils";

const getPayload = (req: Request) => ({
  ...req.body.input.data,
  ...req.params
});

export const ValidationMiddleware =
  (
    schema: ObjectSchema,
    options: AsyncValidationOptions = {},
    payload: (req: Request) => unknown = getPayload
  ) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.validateAsync(payload(req), options);
      return next();
    } catch (error: any) {
      const result = failure(
        error?.details?.[0]?.message,
        StatusCodeEnums.UNPROCESSABLE_ENTITY
      );
      res.status(result.httpCode).send(result.data);
    }
  };
