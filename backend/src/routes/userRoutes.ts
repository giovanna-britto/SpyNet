import express from 'express';
import { setWalletAddress } from '../controllers/userController';
//import { authenticate } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/wallet', setWalletAddress);

export default router;
