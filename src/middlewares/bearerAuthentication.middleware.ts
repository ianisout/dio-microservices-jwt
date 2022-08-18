import { NextFunction, Request, Response } from 'express';
import JWT from 'jsonwebtoken';
import ForbiddenError from '../models/errors/forbidden.error.model';
import userRepository from '../repositories/user.repository';

const throwError = (msg: string) => {
  throw new ForbiddenError(msg);
};

export default async function bearerAuthenticationMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const authorizationHeader: any = req.headers['authorization'];
    if (!authorizationHeader) throwError('Unauthorized');

    const [authType, token] = authorizationHeader.split(' ');
    if (authType !== 'Bearer' || !token) throwError('Invalid authentication');

    const tokenPayload = JWT.verify(token, 'my_secret_key');

    if (typeof tokenPayload !== 'object' || !tokenPayload.sub) {
      throwError('Invalid token');
    }

    const { sub } = tokenPayload;
    const uuid = JSON.stringify(sub).slice(1, 37);
    /*
      *quick fix*
      slicing a stringified JSON because TS was assigning
      a <sub> tag value to the sub in the JWT object
    */

    const user = await userRepository.findById(uuid);

    // const user = { uuid: tokenPayload.sub, username: tokenPayload.username };
    // above more performatic without searching db

    req.user = user;

    next();
  } catch (error) {
    next(error);
  }
}
