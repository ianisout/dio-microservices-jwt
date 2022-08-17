import db from '../db';
import User from '../models/user.model';

class UserRepository {
  async findAllUsers(): Promise<User[]> {
    const query = `
      SELECT uuid, username
      FROM application_user
    `;

    const { rows } = await db.query<User>(query);

    return rows || [];
  }

  async findById(uuid: string): Promise<User> {
    const query = `
      SELECT uuid, username
      FROM application_user
      WHERE uuid = $1
    `;

    // $1 --> first param, $2 would be the second, etc
    // feeds params to query without passing in sensitive info
    // going into values

    const values = [uuid];

    const { rows } = await db.query<User>(query, values);
    const [user] = rows;

    return user;
  }

  async createUser(user: User): Promise<string> {
    const script = `
      INSERT INTO application_user (
        username,
        password
      )
      VALUES ($1, crypt($2, $3))
      RETURNING uuid
    `;

    const values = [user.username, user.password, 'my_salt'];

    const { rows } = await db.query<{ uuid: string }>(script, values);
    const [newUser] = rows;

    return newUser.uuid;
  }

  async updateUser(user: User): Promise<void> {
    const script = `
      UPDATE application_user
      SET
        username = $1,
        password = crypt($2, $3)
      WHERE uuid = $4
    `;

    const values = [user.username, user.password, 'my_salt', user.uuid];

    await db.query(script, values);
  }
}

export default new UserRepository();
