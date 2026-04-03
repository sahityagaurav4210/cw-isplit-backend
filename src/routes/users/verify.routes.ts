import { Router } from 'express';
import { verifyOtpController } from '../../controllers/verify.controller';
import { authRequest, validateVerifyPhoneNumberDTO } from '../../middlewares';

const verifyRoutes = Router();

verifyRoutes.post('/phone', validateVerifyPhoneNumberDTO, authRequest, verifyOtpController);

export default verifyRoutes;
