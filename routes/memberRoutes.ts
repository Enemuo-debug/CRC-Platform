import {Router} from "express";
import type { Request, Response } from "express";
import MemberController from "../controllers/member.controller.js";
import type { OutputMsg } from "../dtos/OutputMessage.js";
import type { IMemberCreate } from "../dtos/ADMINLogIn.js";

const router = Router();

router.post("/newMember", (req: Request<{}, {}, IMemberCreate>, res: Response<OutputMsg>) => {
    MemberController.RegisterMember(req, res);
});

export default router;
