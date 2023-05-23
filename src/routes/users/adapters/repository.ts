import { Knex } from 'knex';
import * as bcrypt from 'bcryptjs';
import { User } from '../domain/user';



export class UserRepository {
  private knex: Knex;

  constructor(knex: Knex) {
    this.knex = knex;
  }

  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  }

  public async createUser(user: User): Promise<User> {
    const hashedPassword = await this.hashPassword(user.password);
    const newUser = { ...user, password: hashedPassword };

    const [createdUser] = await this.knex('users').insert(newUser, '*');
    return createdUser;
  }

  public async getUserById(id: number): Promise<User | null> {
    const user = await this.knex('users').where({ id }).first();
    return user || null;
  }

  public async getUserByUsername(email: string): Promise<User | null> {
    const user = await this.knex('users').where({ email }).first();
    return user || null;
  }

  public async updateUser(id: number, updates: Partial<User>): Promise<User | null> {
    const [updatedUser] = await this.knex('users').where({ id }).update(updates, '*');
    return updatedUser || null;
  }

  public async deleteUser(id: number): Promise<boolean> {
    const deletedRowCount = await this.knex('users').where({ id }).del();
    return deletedRowCount > 0;
  }
}
