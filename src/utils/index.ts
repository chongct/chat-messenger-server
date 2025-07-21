import type { Response } from 'express';
import type { FieldValidationError, Result } from 'express-validator';
import jwt, { SignOptions } from 'jsonwebtoken';

export const validationErrorResponse = (
  res: Response,
  errors: Result,
  failRes: Record<string, string>
) =>
  res.status(422).json({
    error: errors.array().reduce((combinedError, error) => {
      const { msg, path } = error as FieldValidationError;

      return { ...combinedError, [path]: msg };
    }, {}),
    ...failRes,
  });

export const generateAccessToken = (payload: Record<string, string>) => {
  return jwt.sign(payload, process.env.ACCESS_SECRET, {
    expiresIn: process.env.ACCESS_EXPIRES_IN,
  } as SignOptions);
};

export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, process.env.ACCESS_SECRET);
};

export const generateRefreshToken = (payload: Record<string, string>) => {
  return jwt.sign(payload, process.env.REFRESH_SECRET, {
    expiresIn: process.env.REFRESH_EXPIRES_IN,
  } as SignOptions);
};

export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, process.env.REFRESH_SECRET);
};

export const generateCsrfToken = (payload: Record<string, string>) => {
  return jwt.sign(payload, process.env.CSRF_SECRET, {
    expiresIn: process.env.CSRF_EXPIRES_IN,
  } as SignOptions);
};

export const verifyCsrfToken = (token: string) => {
  return jwt.verify(token, process.env.CSRF_SECRET);
};
