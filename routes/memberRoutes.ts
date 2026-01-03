import {Router} from "express";
import type { NextFunction, Request, Response } from "express";
import MemberController from "../controllers/member.controller.js";
import type { OutputMsg } from "../dtos/OutputMessage.js";
import type { IMemberCreate } from "../dtos/ADMINLogIn.js";
import PaymentController from "../controllers/payment.controller.js";

const router = Router();

router.post("/newMember", (req: Request<{}, {}, IMemberCreate>, res: Response<OutputMsg>, next:NextFunction) => {
    MemberController.RegisterMember(req, res, next);
}, (req: Request, res: Response<OutputMsg>) => {
    PaymentController.initPaystack(req, res);
});

export default router;
