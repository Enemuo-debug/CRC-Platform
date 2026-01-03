import type { Request, Response } from "express";
import { Router } from "express";
import AdminController from "../controllers/AuthControllers.js";
import type { OutputMsg } from "../dtos/OutputMessage.js";
import type { LoginDto } from "../dtos/ADMINLogIn.js";
import type { IZone } from "../dtos/ZoneDtos.js";

const router: Router = Router();

router.post("/", (req: Request<LoginDto>, res: Response<OutputMsg>) => {
    AdminController.authenticate(req, res);
})

router.post("/create-zone", (req: Request<IZone>, res: Response<OutputMsg>) => {
    AdminController.createZone(req, res);
})

export default router;
