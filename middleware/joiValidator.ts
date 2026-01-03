import type { Request, Response, NextFunction } from "express";
import type { Schema } from "joi";

type Property = "body" | "params" | "query";

export const validate =
  (schema: Schema, property: Property = "body") =>
  (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      return res.status(400).json({
        message: "Validation error",
        errors: error.details.map((d) => d.message)
      });
    }

    req[property] = value;
    next();
  };
