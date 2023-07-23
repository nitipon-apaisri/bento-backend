import { Router } from "express";
import { getHelloworldController } from "../controllers/exempleController";
import { getMenu } from "../controllers/menuController";
const router = Router();
router.get("/helloworld", getHelloworldController);
router.get("/menu", getMenu);
export default router;
