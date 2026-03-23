import { Router } from 'express';
import appRouter from './app.routes';
import userRouter from './users';
import loginRouter from './login.routes';

const router = Router();

router.use('/app', appRouter);
router.use('/users', userRouter);
router.use('/auth', loginRouter);

export default router;
