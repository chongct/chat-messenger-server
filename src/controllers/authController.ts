import type { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import bcrypt from 'bcrypt';

import { authCookieOptions } from '../config';
import { IUser, User } from '../models';
import { createJwtToken, validationErrorResponse } from '../utils';

const SALT_ROUNDS = 10;

const setAuthenticatedCookie = (user: IUser, res: Response) => {
  const userId = user._id.toString();
  const token = createJwtToken({ id: userId });
  res.cookie('token', token, authCookieOptions).status(200).json({ error: null, userId });
};

export const getAuthStatus = (req: Request, res: Response) => {
  res.status(200).json({ userId: req.userId });
};

export const postLogin = async (req: Request, res: Response) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    validationErrorResponse(res, errors, { userId: null });

    return;
  }

  const { email, password } = req.body;
  const user = await User.findOne({ email });
  const invalidErrorJson = {
    error: {
      message: 'Invalid email or password',
    },
    userId: null,
  };

  if (!user) {
    res.status(401).json(invalidErrorJson);

    return;
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (isMatch) {
    setAuthenticatedCookie(user, res);

    return;
  }

  res.status(401).json(invalidErrorJson);
};

export const postRegister = async (req: Request, res: Response) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    validationErrorResponse(res, errors, { success: false });

    return;
  }

  const { firstName, lastName, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
  const user = new User({ firstName, lastName, email, password: hashedPassword });

  try {
    await user.save();
    setAuthenticatedCookie(user, res);
  } catch (error) {
    console.error(`Failed to register user: ${error}`);
    res.status(500);
  }
};

export const postRefreshToken = (req: Request, res: Response) => {
  res.send('Login route');
};

export const postLogout = (req: Request, res: Response) => {
  res.send('Login route');
};
