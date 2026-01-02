import type { IMemberCreate } from "../dtos/ADMINLogIn.js";
import type { IUser } from "../dtos/CreateUser.js";
import type { Request, Response } from "express";
import type { OutputMsg } from "../dtos/OutputMessage.js";
import Member from "../models/Induvidual.js";

class MemberController {
    async RegisterMember(req: Request<{}, {}, IMemberCreate>, res: Response): Promise<void> {
        const newMember: IUser = {
            FirstName: req.body.FirstName,
            LastName: req.body.LastName,
            MiddleName: req.body.MiddleName,
            Zone: req.body.Zone,
            MaritalStatus: req.body.MaritalStatus,
            Sex: req.body.Sex,
            Address: req.body.Address,
            Age: req.body.Age,
            PhoneNumber: req.body.PhoneNumber,
            CreatedAt: new Date(),
            Expired: true
        }
        
        Member.create(newMember).then((member) => {
            const output: OutputMsg = {
                success: true,
                message: "Member registered successfully",
                data: newMember,
                statusCode: 201
            };
            res.status(output.statusCode).json(output);
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
}

export default new MemberController();