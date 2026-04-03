import { Router } from 'express';
import { createUserController } from '../../controllers/users.controller';
import { validateUserRegistrationDTOMiddleware } from '../../middlewares';
import profileRouter from './profile.routes';
import sendRoutes from './send.routes';
import verifyRoutes from './verify.routes';

const userRouter = Router();

userRouter.post('/register', validateUserRegistrationDTOMiddleware, createUserController);
userRouter.use('/profile', profileRouter);
userRouter.use('/send', sendRoutes);
userRouter.use('/verify', verifyRoutes);

export default userRouter;
