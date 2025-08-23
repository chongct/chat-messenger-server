import { Request, Response } from 'express';
import bcrypt from 'bcrypt';

import * as authController from '../src/controllers';
import { User } from '../src/models';
import * as utils from '../src/utils';

jest.mock('../src/models');
jest.mock('../src/utils');

describe('authController', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    req = {
      body: {},
      cookies: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      cookie: jest.fn().mockReturnThis(),
      clearCookie: jest.fn().mockReturnThis(),
      sendStatus: jest.fn(),
    };
    jest.clearAllMocks();
  });

  describe('postLogin', () => {
    it('should return 401 if user not found', async () => {
      (User.findOne as jest.Mock).mockResolvedValue(null);
      req.body = { email: 'test@example.com', password: 'password' };

      await authController.postLogin(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: expect.any(Object) }));
    });

    it('should return 401 if password does not match', async () => {
      (User.findOne as jest.Mock).mockResolvedValue({ password: 'hashed' });
      (utils.validationErrorResponse as jest.Mock).mockImplementation(() => {});
      (bcrypt.compare as jest.Mock) = jest.fn().mockResolvedValue(false);
      req.body = { email: 'test@example.com', password: 'wrong' };

      await authController.postLogin(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(401);
    });

    // Add more tests for successful login, validation errors, etc.
  });

  // Add similar describe blocks for postRegister, postRefreshToken, postLogout, getAuthStatus
});
