import { NextFunction, Request, Response, Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import JWT from 'jsonwebtoken';
import basicAuthenticationMiddleware from '../middlewares/basicAuthentication.middleware';
import bearerAuthenticationMiddleware from '../middlewares/bearerAuthentication.middleware';
import ForbiddenError from '../models/errors/forbidden.error.model';

const authorizationRoute = Router();

authorizationRoute.post(
  '/token/validate',
  bearerAuthenticationMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.sendStatus(StatusCodes.OK);
      next();
    } catch (error) {
      next(error);
    }
  }
);

authorizationRoute.post(
  '/token',
  basicAuthenticationMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user;

      if (!user) throw new ForbiddenError(`Where's the user?`);

      const jwtPayload = { username: user?.username };
      const jwtOptions = { subject: user?.uuid };
      const secretKey = 'my_secret_key';

      const jwt = JWT.sign(jwtPayload, secretKey, jwtOptions);

      res.status(StatusCodes.OK).json({ token: jwt });
    } catch (error) {
      next(error);
    }
  }
);

export default authorizationRoute;
