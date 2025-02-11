import { Knex } from 'knex';
import { hashPassword } from './password-hash';
import { InsertUserData, User } from '../domain/user';

export default class UserRepository {
  private knex: Knex;

  constructor(knex: Knex) {
    this.knex = knex;
  }

  private async hashPassword(password: string): Promise<string> {
    return hashPassword(password);
  }

  public async createUser(user: InsertUserData): Promise<User> {
    const hashedPassword = await this.hashPassword(user.password);
    const newUser = { ...user, password: hashedPassword };

    const [createdUser] = await this.knex('users').insert(newUser, '*');
    return createdUser;
  }

  public async getUserById(id: number): Promise<User | null> {
    const user = await this.knex('users').where({ id }).first();
    return user || null;
  }

  public async getUserByEmail(email: string): Promise<User | null> {
    const user = await this.knex('users').where({ email }).first();
    return user || null;
  }

  public async updateUser(
    id: number,
    updates: Partial<User>,
  ): Promise<User | null> {
    const [updatedUser] = await this.knex('users')
      .where({ id })
      .update(updates, '*');
    return updatedUser || null;
  }

  public async deleteUser(id: number): Promise<boolean> {
    const deletedRowCount = await this.knex('users').where({ id }).del();
    return deletedRowCount > 0;
  }
}
