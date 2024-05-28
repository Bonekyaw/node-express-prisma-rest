import express from 'express';

import { register, verifyOTP, confirmPassword, login, refreshToken } from '../../controllers/authController';
import { validatePhone } from '../../middlewares/check';

const router = express.Router();

/* 
 * POST localhost:8080/api/v1/register 
 * Register an admin using Phone & password only
 * In real world, OTP should be used to verify phone number 
 * But in this app, we will simulate fake OTP - 123456 
*/

router.post('/register', validatePhone, register);
router.post('/verify-otp', verifyOTP);
router.post('/confirm-password', confirmPassword);
router.post('/login', validatePhone, login);

// Refresh Token for expired jwt token. 
router.post('/refresh-token', refreshToken);

export default router;