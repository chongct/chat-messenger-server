import type { Request, Response, NextFunction } from 'express';
import type { JwtPayload } from 'jsonwebtoken';

import { verifyJwtToken } from '../utils';

export const verifyAuth = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.token;

  if (!token) {
    res.sendStatus(401);

    return;
  }

  try {
    const decodedJwt = verifyJwtToken(req.cookies.token) as JwtPayload;
    const { id } = decodedJwt ?? {};
    req.userId = id;
    next();
  } catch (error) {
    console.error(`[verifyAuth] error: ${error}`);
    res.sendStatus(401);
  }
};
