import { Router } from 'express';
import appRouter from './app.routes';
import userRouter from './users.routes';

const router = Router();

router.use('/app', appRouter);
router.use('/users', userRouter);

export default router;
