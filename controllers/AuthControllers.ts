import type { Request, Response } from "express";
import type { LoginDto } from "../dtos/ADMINLogIn.js";
import type { OutputMsg } from "../dtos/OutputMessage.js";
import { signToken, verifyToken } from "../utils/jwt.js";
import Zone from "../models/Zones.js";
import type { IZone } from "../dtos/ZoneDtos.js";
import Member from "../models/Induvidual.js";

class AdminControllers {
    async authenticate(req: Request<{}, {}, LoginDto>, res: Response<OutputMsg>) {
        const success = req.body.EmailAddress === process.env.emailAddress as string && 
                        req.body.Password === process.env.password as string;

        if (!success) {
            return res.status(401).json({
                statusCode: 401,
                success: false,
                message: "Invalid credentials",
                data: null
            } as OutputMsg);
        }

        const token: string = signToken(req.body);

        // Set cookie with proper options
        res.cookie("CRC", token, {
            httpOnly: true, // Not accessible via client-side scripts
            secure: true, // Must be true when sameSite is 'none'
            sameSite: 'none', // Important for cross-origin!
            maxAge: 24 * 60 * 60 * 1000, // 24 hours
            path: '/' // Available on all routes
        });

        console.log("✅ Cookie set successfully:", token.substring(0, 20) + "...");

        return res.status(200).json({
            statusCode: 200,
            success: true,
            message: "Authenticated",
            data: { EmailAddress: req.body.EmailAddress }
        } as OutputMsg);
    }

    async createZone(req: Request<{}, {}, IZone>, res: Response<OutputMsg>) {
        console.log("All cookies:", req.cookies);
        console.log("CRC cookie:", req.cookies["CRC"]);
        console.log("Headers:", req.headers.cookie);
        
        const cookie = req.cookies["CRC"];
        
        if (!cookie) {
            console.log("❌ No CRC cookie found");
            return res.status(401).json({
                statusCode: 401,
                success: false,
                message: "Unauthorized, Invalid or missing token",
                data: null
            } as OutputMsg);
        }
        
        let validAdminDetails: LoginDto;
        
        try {
            validAdminDetails = verifyToken(cookie);
            console.log("Decoded token:", validAdminDetails);
        } catch (error) {
            console.log("❌ Token verification failed:", error);
            return res.status(401).json({
                statusCode: 401,
                success: false,
                message: "Unauthorized, Invalid or missing token",
                data: null
            } as OutputMsg);
        }

        if (!validAdminDetails || 
            validAdminDetails.EmailAddress !== process.env.emailAddress || 
            validAdminDetails.Password !== process.env.password) {
            console.log("❌ Invalid admin credentials");
            return res.status(401).json({
                statusCode: 401,
                success: false,
                message: "Unauthorized, Invalid credentials",
                data: null
            } as OutputMsg);
        }

        try {
            const zone = await Zone.create({
                ZoneName: req.body.ZoneName
            });
            
            return res.status(201).json({
                statusCode: 201,
                success: true,
                message: "Zone created successfully",
                data: zone
            } as OutputMsg);
        } catch (error) {
            console.log("❌ Database error:", error);
            return res.status(500).json({
                statusCode: 500,
                success: false,
                message: "Server Error...",
                data: error
            } as OutputMsg);
        }
    }

    async FetchAllMembers(req: Request, res: Response<OutputMsg>) {
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

        const members = await Member.find().populate("Zone", "ZoneName").sort({ createdAt: -1 });
        const output: OutputMsg = {
            statusCode: 200,
            success: true,
            message: "Members fetched successfully",
            data: members
        };
        return res.status(output.statusCode).json(output);
    }
}

export default new AdminControllers();
