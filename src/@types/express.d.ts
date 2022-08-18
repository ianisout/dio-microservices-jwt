/*
  d stands for "definition"

  this goes with
  "typeRoots": [
      "./src/@types",
  in tsconfig.json

*/

import { User } from '../models/user.model';

declare module 'express-serve-static-core' {
  interface Request {
    user?: User;
  }
}
