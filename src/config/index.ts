import { CookieOptions } from 'express';

export const authCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'none',
  maxAge: 60 * 60 * 1000,
} as CookieOptions;
