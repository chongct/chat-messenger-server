import { CookieOptions } from 'express';

export const authCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'lax' : 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
} as CookieOptions;
