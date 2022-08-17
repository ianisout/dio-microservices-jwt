import express, { Request, Response, NextFunction } from 'express';
import usersRoute from './routes/users.route';

const app = express();

app.use(express.json());

app.use(usersRoute);

app.get('/status', (req: Request, res: Response, next: NextFunction) => {
  res.status(200).send({ foo: 'bar asd' });
});

app.listen(3000, () => console.log('Up and running on port 3000'));
