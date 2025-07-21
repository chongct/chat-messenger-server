import type { Request, Response, NextFunction } from 'express';
import type { JwtPayload } from 'jsonwebtoken';

import { verifyAccessToken, verifyCsrfToken } from '../utils';

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

export const verifyCsrf = (req: Request, res: Response, next: NextFunction) => {
  const csrfToken = req.headers['x-csrf-token'];

  if (!csrfToken) {
    res.sendStatus(403);

    return;
  }

  try {
    verifyCsrfToken(csrfToken as string);
    next();
  } catch (error) {
    console.error(`[verifyCsrf] error: ${error}`);
    res.sendStatus(403);
  }
};
