import type { Request, Response } from "express";
import type { LoginDto } from "../dtos/ADMINLogIn.js";
import type { OutputMsg } from "../dtos/OutputMessage.js";
import { signToken, verifyToken } from "../utils/jwt.js";
import Zone from "../models/Zones.js";
import type { IZone } from "../dtos/ZoneDtos.js";

class AdminControllers {
    async authenticate(req: Request<{}, {}, LoginDto>, res: Response<OutputMsg>) {
        const success = req.body.EmailAddress === process.env.emailAddress as string && req.body.Password === process.env.password as string;

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

    async createZone(req: Request<{}, {}, IZone>, res: Response<OutputMsg>) {
        const cookie = req.cookies["CRC"];
        let validAdminDetails: LoginDto = verifyToken(cookie);

        if (!cookie || validAdminDetails == null || validAdminDetails.EmailAddress !== process.env.emailAddress || validAdminDetails.Password !== process.env.password) {
            return res.status(401).json({
                statusCode: 401,
                success: false,
                message: "Unauthorized, Invalid or missing token",
                data: null
            } as OutputMsg);
        }

        Zone.create(req.body).then((zone) => {
            const output: OutputMsg = {
                statusCode: 201,
                success: true,
                message: "Zone created successfully",
                data: zone
            };
            return res.status(output.statusCode).json(output);
        }).catch((error) => {
            const output: OutputMsg = {
                statusCode: 500,
                success: false,
                message: "Server Error...",
                data: error
            };
            return res.status(output.statusCode).json(output);
        });
    }
}

export default new AdminControllers();
