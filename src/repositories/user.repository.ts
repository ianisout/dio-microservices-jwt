import db from '../db';
import DatabaseError from '../models/errors/database.error.model';
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
    try {
      const query = `
        SELECT uuid, username
        FROM application_user
        WHERE uuid = $1
      `;

      const values = [uuid];

      const { rows } = await db.query<User>(query, values);
      const [user] = rows;

      return user;
    } catch (error) {
      throw new DatabaseError('Error finding user by ID', error);
    }
  }

  async findByUsernameAndPassword(
    username: string,
    password: string
  ): Promise<User | null> {
    try {
      const query = `
      SELECT uuid, username
      FROM application_user
      WHERE username = $1
      AND password = crypt($2, $3)
    `;

      const values = [username, password, 'my_salt'];
      const { rows } = await db.query<User>(query, values);
      const [user] = rows;

      return user || null;
    } catch (error) {
      throw new DatabaseError(
        'Error retrieving username and/or password',
        error
      );
    }
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

  async deleteUser(uuid: string): Promise<void> {
    const script = `
      DELETE
      FROM application_user
      WHERE uuid = $1

    `;

    const values = [uuid];

    await db.query(script, values);
  }
}

export default new UserRepository();
