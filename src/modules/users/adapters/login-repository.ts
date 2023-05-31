import { Knex } from 'knex';
import * as bcrypt from 'bcryptjs';
import { Repository } from '../domain/login';
import UserRepository from './repository';

export default class LoginRepository implements Repository {
  knex: Knex;

  constructor(knex: Knex) {
    this.knex = knex;
  }

  async getUser(email: string) {
    const userRepo = new UserRepository(this.knex);

    return userRepo.getUserByEmail(email);
  }

  async checkPassword(email: string, password: string): Promise<boolean> {
    const user = await this.getUser(email);

    if (!user) return false;

    const passwordHash = user?.password;

    return bcrypt.compare(password, passwordHash);
  }
}
