import { Router } from "express";
import { getHelloworldController } from "../controllers/exempleController";
import { getMenu, registerMenu } from "../controllers/menuController";
import { registerUser, signIn } from "../controllers/userController";
import { auth } from "../middlewares/auth";
import { isAdmin } from "../middlewares/userAccess";
const router = Router();
router.get("/helloworld", getHelloworldController);
router.get("/menu", getMenu);
router.post("/menu", auth, isAdmin, registerMenu);
router.post("/user", registerUser);
router.post("/signIn", signIn);
router.post("/auth", auth, isAdmin);
export default router;
