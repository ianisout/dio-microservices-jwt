import express from 'express';
import errorHandler from './middlewares/errorHandler.middleware';
import statusRoute from './routes/status.route';
import usersRoute from './routes/users.route';
require('dotenv').config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(usersRoute);
app.use(statusRoute);

app.use(errorHandler);

app.listen(3000, () => console.log('Up and running on port 3000'));
