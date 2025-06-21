import { Request, Response } from 'express';

export const authTest = (req: Request, res: Response) => {
  res.send('Login test');
};

export const postLogin = (req: Request, res: Response) => {
  console.log('req.body', req.body);
  res.send('Login route');
};
