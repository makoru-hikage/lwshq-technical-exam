import { Knex } from 'knex';
import UserRepository from '../src/modules/users/adapters/repository';

export async function seed(knex: Knex): Promise<void> {
  const userRepo = new UserRepository(knex);

  await userRepo.createUser({
    name: 'Isabela Bettor',
    email: 'sample@test.com',
    password: 'P@ssw0rd',
  });

}
