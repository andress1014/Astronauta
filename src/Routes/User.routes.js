import { Router } from "express";
import { addUser, logUser } from "../Controllers/UserController";
import { verifyToken } from "../middleware/verifyToken";

const router = Router();

router.post('/addUser', addUser);
router.post('/login', logUser);
router.get('/token', verifyToken);

export default router;
