import { Router } from 'express';
import { createUserController } from '../../controllers/users.controller';
import { validateUserRegistrationDTOMiddleware } from '../../middlewares';
import profileRouter from './profile.routes';
const userRouter = Router();

userRouter.post('/register', validateUserRegistrationDTOMiddleware, createUserController);
userRouter.use('/profile', profileRouter);

export default userRouter;
