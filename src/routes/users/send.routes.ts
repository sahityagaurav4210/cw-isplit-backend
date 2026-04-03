import { Router } from 'express';
import { authRequest } from '../../middlewares';
import { sendOtpController } from '../../controllers/verify.controller';

const sendRoutes = Router();

sendRoutes.post('/otp/phone', authRequest, sendOtpController);

export default sendRoutes;
