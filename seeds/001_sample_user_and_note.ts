import { Knex } from 'knex';
import UserRepository from '../src/modules/users/adapters/repository';
import NoteRepository from '../src/modules/notes/adapters/repository';

export async function seed(knex: Knex): Promise<any> {
  const userRepo = new UserRepository(knex);

  const user = await userRepo.createUser({
    name: 'Isabela Bettor',
    email: 'sample@test.com',
    password: 'P@ssw0rd',
  });

  const noteRepo = new NoteRepository(knex);

  return noteRepo.create({
    user_id: user.id,
    title: 'Sample Note',
    text: 'This is a sample note.',
  });
}
