import express from 'express';
import {
  registerUser,
  verifyEmail,
  loginUser,
  isAuth,
  logout
} from '../controllers/userController.js';

import authUser from '../middlewares/authUser.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/verify-email', verifyEmail);
router.post('/login', loginUser);
router.get('/is-auth', authUser, isAuth);
router.get('/logout', authUser, logout);

export default router;
