import type { Request, Response, NextFunction } from 'express';
import type { JwtPayload } from 'jsonwebtoken';

import { verifyAccessToken } from '../utils';

export const verifyAuth = (req: Request, res: Response, next: NextFunction) => {
  const bearerAccessToken = req.headers['authorization'];

  if (!bearerAccessToken) {
    res.sendStatus(401);

    return;
  }

  try {
    const [, accessToken] = bearerAccessToken.split(' ');

    if (!accessToken) {
      throw new Error('No access token');
    }

    const decodedJwt = verifyAccessToken(accessToken) as JwtPayload;
    const { id } = decodedJwt ?? {};
    req.userId = id;
    next();
  } catch (error) {
    console.error(`[verifyAuth] error: ${error}`);
    res.sendStatus(401);
  }
};
