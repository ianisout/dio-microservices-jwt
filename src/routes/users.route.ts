import { Router, Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';

const usersRoute = Router();

// get /users
// get /users/:uuid
// post /users
// put /users/:uuid
// delete /users/:uuid

usersRoute.get('/users', (req: Request, res: Response, next: NextFunction) => {
  const users = [{ username: 'Ian' }];

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
