import { Router } from 'express';
import { authRequest, uploadMiddleware, validateEditUserProfileDTOMiddleware } from '../../middlewares';
import { editUserProfileController, getUserProfileController } from '../../controllers/users.controller';

const profileRouter = Router();

profileRouter.post('/edit', uploadMiddleware, validateEditUserProfileDTOMiddleware, authRequest, editUserProfileController);
profileRouter.get('/view', authRequest, getUserProfileController);

export default profileRouter;
