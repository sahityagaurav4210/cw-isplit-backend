import { Router } from 'express';
import { createUserController } from '../controllers/users.controller';
const userRouter = Router();

userRouter.post('/register', createUserController);

export default userRouter;
