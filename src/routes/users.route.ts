import { NextFunction, Request, Response, Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import userRepository from '../repositories/user.repository';

const usersRoute = Router();

usersRoute.get('/users', async (req: Request, res: Response, next: NextFunction) => {
  const users = await userRepository.findAllUsers();

  res.status(StatusCodes.OK).json(users);
});

usersRoute.get(
  '/users/:uuid',
  (req: Request<{ uuid: string }>, res: Response, next: NextFunction) => {
    const { uuid } = req.params;

    // const user = database.getUserByUuid(uuid)

    res.status(StatusCodes.OK).json(uuid);
  }
);

usersRoute.post('/users', (req: Request, res: Response, next: NextFunction) => {
  const newUser = req.body;
  console.log(newUser);

  res.sendStatus(StatusCodes.CREATED); /* .send(newUser) */
});

usersRoute.put(
  '/users/:uuid',
  (req: Request<{ uuid: string }>, res: Response, next: NextFunction) => {
    const { uuid } = req.params;
    const modifiedUser = req.body;

    modifiedUser.uuid = uuid;

    res.status(StatusCodes.OK).send({ uuid });
  }
);

usersRoute.delete(
  '/users/:uuid',
  (req: Request<{ uuid: string }>, res: Response, next: NextFunction) => {
    const { uuid } = req.params;

    res.sendStatus(StatusCodes.OK);
  }
);

export default usersRoute;
