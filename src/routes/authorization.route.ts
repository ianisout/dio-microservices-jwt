import { NextFunction, Request, Response, Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import JWT from 'jsonwebtoken';
import ForbiddenError from '../models/errors/forbidden.error.model';
import userRepository from '../repositories/user.repository';

const throwError = (msg: string) => {
  throw new ForbiddenError(msg);
};

const authorizationRoute = Router();

authorizationRoute.post(
  '/token',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authorizationHeader: any = req.headers['authorization'];

      if (!authorizationHeader) throwError('Unauthorized');

      const [authType, token] = authorizationHeader.split(' ');

      if (authType !== 'Basic' || !token) throwError('Invalid authentication');

      const tokenContent = Buffer.from(token, 'base64').toString('utf-8');
      const [username, password] = tokenContent.split(':');

      if (!username || !password) throwError('Missing credentials');

      const user = await userRepository.findByUsernameAndPassword(
        username,
        password
      );

      if (!user) throwError('Bad credentials');

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
