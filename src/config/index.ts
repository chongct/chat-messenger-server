import { CookieOptions } from 'express';

export const authCookieOptions = {
  httpOnly: false, // disabled as ios third party cookies not working
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
} as CookieOptions;
