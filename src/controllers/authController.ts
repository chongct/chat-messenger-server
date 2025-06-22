import { Request, Response } from 'express';
import { validationResult, type FieldValidationError } from 'express-validator';
import bcrypt from 'bcrypt';

import { User } from '../models';

const SALT_ROUNDS = 10;

export const authTest = (req: Request, res: Response) => {
  res.send('Login test');
};

export const postLogin = (req: Request, res: Response) => {
  res.send('Login route');
};

export const postRegister = async (req: Request, res: Response) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(422).json({
      error: errors.array().reduce((combinedError, error) => {
        const { msg, path } = error as FieldValidationError;

        return { ...combinedError, [path]: msg };
      }, {}),
    });

    return;
  }

  const { firstName, lastName, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
  const user = new User({ firstName, lastName, email, password: hashedPassword });

  try {
    await user.save();
    res.status(200).json({ success: true });
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
