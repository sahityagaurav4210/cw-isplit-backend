import { Router } from 'express';
import { authRequest, uploadMiddleware } from '../../middlewares';
import { editUserProfileController } from '../../controllers/users.controller';

const profileRouter = Router();

profileRouter.post('/profile', uploadMiddleware, authRequest, editUserProfileController);

export default profileRouter;
