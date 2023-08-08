import express from 'express';
import { loginWithEmailAndPassword, logoutCheckDatetimeWithEmail } from './LoginController';

const router = express.Router();

// login with email and password
router.route('/').post(loginWithEmailAndPassword);

// Logout with email
router.route('/logout').post(logoutCheckDatetimeWithEmail);

export { router };
