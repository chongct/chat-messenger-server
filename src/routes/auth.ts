import { Router } from 'express';
import { body, check } from 'express-validator';

import {
  getAuthStatus,
  postLogin,
  postRegister,
  postRefreshToken,
  postLogout,
  getCsrfToken,
} from '../controllers';
import { User } from '../models';
import { verifyAuth, verifyCsrf } from '../middlewares';

const authRouter = Router();

authRouter.get('/status', verifyAuth, getAuthStatus);

authRouter.post(
  '/login',
  [
    body('email').isEmail().withMessage('Please enter a valid email').normalizeEmail(),
    body('password').isLength({ min: 2 }).trim(),
  ],
  postLogin
);

authRouter.post(
  '/register',
  [
    check('email')
      .isEmail()
      .withMessage('Please enter a valid email')
      .custom(async (email) => {
        const user = await User.findOne({ email });

        if (user) {
          return Promise.reject('Email already in use');
        }
      })
      .normalizeEmail(),
    body('password').isLength({ min: 2 }).trim(),
    body('confirmPassword')
      .trim()
      .custom((confirmPassword, { req }) => {
        if (confirmPassword !== req.body.password) {
          throw new Error('Password confirmation does not match password');
        }

        return true;
      }),
  ],
  postRegister
);

authRouter.post('/refresh', verifyCsrf, postRefreshToken);
authRouter.post('/logout', verifyCsrf, postLogout);
authRouter.get('/csrf-token', getCsrfToken);

export { authRouter };
