import { Router } from 'express';
import { getUserInformation, refreshToken, signIn, signOut, signUp } from '../controllers/authController';

const router = Router();

router.post('/sign-up', signUp);
router.post('/sign-in', signIn);
router.post('/sign-out', signOut);
router.get('/user-information/:id', getUserInformation);
router.post('/refresh-token', refreshToken);

export default router;