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

export const createJwtToken = (payload: Record<string, string>) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  } as SignOptions);
};

export const verifyJwtToken = (token: string) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};
