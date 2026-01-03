import type { Request, Response, NextFunction } from "express";
import Zone from "../models/Zones.js";
import Joi from "joi";
import { Gender, MaritalStates } from "../dtos/CreateUser.js";

const MaritalStatuses = Object.values(MaritalStates);
const Genders = Object.values(Gender);

export const validateZoneExists = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const zoneId = req.body.Zone;

  const exists = await Zone.exists({ _id: zoneId });
  if (!exists) {
    return res.status(400).json({
      message: "Zone does not exist"
    });
  }

  next();
};

export const createUserSchema = Joi.object({
    FirstName: Joi.string().min(3).required(),
    MiddleName: Joi.string().required(),
    LastName: Joi.string().min(3).required(),

    Zone: Joi.string()
        .hex()
        .length(24)
        .required(),

    Sex: Joi.string().valid(...Genders).required(),
    MaritalStatus: Joi.string()
        .valid(...MaritalStatuses)
        .required(),

    Address: Joi.string().min(5).required(),
    Age: Joi.number().integer().min(0).required(),
    PhoneNumber: Joi.string()
        .pattern(/^\+234[789][01]\d{8}$/)
        .required()
});