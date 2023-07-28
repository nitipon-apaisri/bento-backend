import { Router } from "express";
import { deleteMenu, getMenu, registerMenu, updateMenu } from "../controllers/menuController";
import { getUsers, registerUser, signIn, updatePassword, updateUser } from "../controllers/userController";
import { auth } from "../middlewares/auth";
import { isAdmin } from "../middlewares/userAccess";
const router = Router();

//Auth
router.post("/signIn", signIn);

//Menu
router.get("/menu", getMenu);
router.post("/menu", auth, isAdmin, registerMenu);
router.put("/menu/:id", auth, isAdmin, updateMenu);
router.delete("/menu/:id", auth, isAdmin, deleteMenu);

//User
router.get("/users", auth, isAdmin, getUsers);
router.post("/user", registerUser);
router.put("/user/:id", auth, isAdmin, updateUser);
router.patch("/user/:id/changePassword", updatePassword);
export default router;
