import { Router } from 'express';

import { authTest, postLogin } from '../controllers';

const authRouter = Router();

authRouter.get('/', authTest);
authRouter.post('/login', postLogin);

export { authRouter };
