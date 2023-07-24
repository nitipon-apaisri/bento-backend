import { Router } from "express";
import { getHelloworldController } from "../controllers/exempleController";
import { getMenu, registerMenu } from "../controllers/menuController";
const router = Router();
router.get("/helloworld", getHelloworldController);
router.get("/menu", getMenu);
router.post("/menu", registerMenu);
export default router;
