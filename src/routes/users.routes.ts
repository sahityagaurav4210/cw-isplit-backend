import { Router } from 'express';
import { createUserController } from '../controllers/users.controller';
import { validateUserRegistrationDTOMiddleware } from '../middlewares';
const userRouter = Router();

userRouter.post('/register', validateUserRegistrationDTOMiddleware, createUserController);

export default userRouter;
