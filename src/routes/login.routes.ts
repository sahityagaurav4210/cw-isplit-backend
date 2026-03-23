import { Router } from 'express';
import { validateUserLoginDTOMiddleware } from '../middlewares/sessions.middleware';
import {
  generateNewAccessTokenController,
  getMeController,
  loginController,
  logoutController,
} from '../controllers/login.controller';
import { authRequest } from '../middlewares';
const loginRouter = Router();

loginRouter.post('/login', validateUserLoginDTOMiddleware, loginController);
loginRouter.post('/logout', authRequest, logoutController);

loginRouter.get('/get-me', authRequest, getMeController);
loginRouter.post('/generate', generateNewAccessTokenController);

export default loginRouter;
