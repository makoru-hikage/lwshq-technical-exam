import {Knex} from 'knex';
import UserRepository from '../src/routes/users/adapters/repository';

export async function seed(knex: Knex): Promise<any> {
  const repo = new UserRepository(knex);

  return repo.createUser({
    name: 'Isabela Bettor',
    email: 'sample@test.com',
    password: 'P@ssw0rd'
  });
}
