import type { Request, Response } from "express";
import type { LoginDto } from "../dtos/ADMINLogIn.js";
import type { OutputMsg } from "../dtos/OutputMessage.js";
import { signToken } from "../utils/jwt.js";
import Zone from "../models/Zones.js";

class AdminControllers {
    async authenticate(req: Request<{}, {}, LoginDto>, res: Response<OutputMsg>) {
        const success = req.body.EmailAddress === process.env.emailAddress as string;

        const output: OutputMsg = {
            statusCode: success ? 200 : 401,
            success,
            message: success ? "Authenticated" : "Invalid credentials",
            data: null
        };

        const token: string = signToken(req.body);

        res.cookie("CRC", token, {
            httpOnly: true,
            secure: true,
            sameSite: "strict"
        })

        return res.status(output.statusCode).json(output);
    }

    async createZone(req: Request, res: Response<OutputMsg>) {
        const zone = Zone.create(req.body);

        const output: OutputMsg = {
            statusCode: 201,
            success: true,
            message: "Zone created successfully",
            data: zone
        };
    }
}

export default new AdminControllers();
