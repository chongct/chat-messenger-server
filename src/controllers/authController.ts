import type { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import type { JwtPayload } from 'jsonwebtoken';

import { authCookieOptions } from '../config';
import { REFRESH_TOKEN_COOKIE } from '../constants';
import { IUser, User, RefreshToken } from '../models';
import {
  generateAccessToken,
  generateRefreshToken,
  validationErrorResponse,
  verifyRefreshToken,
} from '../utils';

const SALT_ROUNDS = 10;

const generateTokens = async (user: IUser, res: Response) => {
  const userId = user._id.toString();
  const accessToken = generateAccessToken({ id: userId });
  const refreshToken = generateRefreshToken({ id: userId });
  const refreshTokenEntry = new RefreshToken({ user: userId, refreshToken });

  try {
    const storedUser = await RefreshToken.findOne({ user: userId });

    if (storedUser) {
      storedUser.refreshToken = refreshToken;
      await storedUser.save();
    } else {
      await refreshTokenEntry.save();
    }
  } catch (error) {
    console.error(`Failed to save refresh token: ${error}`);
  }

  res
    .cookie(REFRESH_TOKEN_COOKIE, refreshToken, authCookieOptions)
    .status(200)
    .json({ error: null, accessToken, userId });
};

export const getAuthStatus = (req: Request, res: Response) => {
  res.status(200).json({ userId: req.userId });
};

export const postLogin = async (req: Request, res: Response) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    validationErrorResponse(res, errors, { userId: '' });

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
    generateTokens(user, res);

    return;
  }

  res.status(401).json(invalidErrorJson);
};

export const postRegister = async (req: Request, res: Response) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    validationErrorResponse(res, errors, { userId: '' });

    return;
  }

  const { firstName, lastName, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
  const user = new User({ firstName, lastName, email, password: hashedPassword });

  try {
    await user.save();
    generateTokens(user, res);
  } catch (error) {
    console.error(`Failed to register user: ${error}`);
    res.status(500);
  }
};

export const postRefreshToken = async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies ?? {};

  if (!refreshToken) {
    res.sendStatus(401);

    return;
  }

  const refreshTokenEntry = await RefreshToken.findOne({ refreshToken });

  if (!refreshTokenEntry) {
    res.sendStatus(403);

    return;
  }

  const { refreshToken: storedRefreshToken } = refreshTokenEntry;
  const decodedJwt = verifyRefreshToken(storedRefreshToken) as JwtPayload;
  const { id } = decodedJwt ?? {};
  const user = await User.findById(id);

  if (user) {
    generateTokens(user, res);

    return;
  }

  res.sendStatus(403);
};

export const postLogout = async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies ?? {};
  await RefreshToken.deleteOne({ refreshToken });
  res.clearCookie(REFRESH_TOKEN_COOKIE, authCookieOptions);
  res.status(200).json({ userId: '' });
};
