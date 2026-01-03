import type { IMemberCreate } from "../dtos/ADMINLogIn.js";
import type { IUser } from "../dtos/CreateUser.js";
import { MaritalStates, Gender } from "../dtos/CreateUser.js";
import type { NextFunction, Request, Response } from "express";
import type { OutputMsg } from "../dtos/OutputMessage.js";
import Member from "../models/Induvidual.js";
import { calculatePrice } from "../utils/calculate-price.js";
import mongoose from "mongoose";
import Zone from "../models/Zones.js";

class MemberController {
    async RegisterMember(req: Request<{}, {}, IMemberCreate>, res: Response, next: NextFunction): Promise<void> {
        const newMember: IUser = {
            FirstName: req.body.FirstName,
            LastName: req.body.LastName,
            MiddleName: req.body.MiddleName,
            Zone: req.body.Zone as mongoose.Types.ObjectId,
            MaritalStatus: req.body.MaritalStatus,
            Sex: req.body.Sex,
            Address: req.body.Address,
            Age: req.body.Age,
            PhoneNumber: req.body.PhoneNumber,
            CreatedAt: new Date(),
            Expired: true
        }
        
        Member.create(newMember).then((member) => {
            req.member = {
                _id: member._id,
                price: calculatePrice(MaritalStates[member.MaritalStatus as keyof typeof MaritalStates], Gender[member.Sex as keyof typeof Gender])
            };
            next();
        }).catch((error) => {
            const output: OutputMsg = {
                success: false,
                message: "Server Error...",
                data: error,
                statusCode: 500
            }
            res.status(output.statusCode).json(output);
        });
    }

    async GetAllZonesEndpoint(req: Request, res: Response<OutputMsg>): Promise<void> {
        try {
            const zones = await Zone.find().sort({ ZoneName: 1 });
            res.status(200).json({
                success: true,
                message: "Zones fetched successfully",
                data: zones,
                statusCode: 200
            } as OutputMsg);
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Server Error...",
                data: error,
                statusCode: 500
            } as OutputMsg);
        }
    }
}

export default new MemberController();