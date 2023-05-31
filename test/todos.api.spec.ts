import { test } from 'tap';
import { FastifyInstance } from 'fastify';
import * as dotenv from 'dotenv';
import app from '../server';
import {
  testKnexConfig,
  runMigrationAndSeeder,
  knex as helperKnex,
} from './db-config';
import {
  TodoInsertData,
  TodoUpdateData,
} from '../src/modules/todos/domain/todos';

dotenv.config();

let testApp: FastifyInstance;

interface Cookie {
  name: string;
  value: string;
  expires?: Date;
  maxAge?: number;
  secure?: boolean;
  httpOnly?: boolean;
  sameSite?: string;
  [name: string]: unknown;
}

// Let's say this is a cookie jar.
// We don't have something like Express superagent
let loginCookie: Cookie | undefined;

// The ID of the single note we'll test.
let newTodoId: string;

test('Setup', async t => {
  t.plan(2);

  try {
    await runMigrationAndSeeder();
    testApp = await app({ knexConfig: testKnexConfig });
  } catch (err) {
    console.error(err);
  }

  const loginResponse = await testApp.inject({
    method: 'POST',
    url: '/users/login',
    payload: {
      email: 'sample@test.com',
      password: 'P@ssw0rd',
    },
  });

  loginCookie = loginResponse.cookies.find(i => i.name === 'logged_user');

  t.equal(loginResponse.statusCode, 200, 'User logged in!');
  t.pass('Fastify server setup complete');
});

test('The Creation', async t => {
  // Create Todo
  const newTodo: Omit<TodoInsertData, 'user_id'> = {
    title: 'Wash the dishes!',
    description: 'This is a test task',
    priority: 'LOW',
  };

  const createResponse = await testApp.inject({
    method: 'POST',
    url: '/todos',
    payload: newTodo,
    cookies: { logged_user: loginCookie?.value ?? '' },
  });

  t.equal(createResponse.statusCode, 201, 'Todo created!');

  const createdItem = JSON.parse(createResponse.payload);
  newTodoId = createdItem.data.id;

  t.equal(createdItem.data.title, newTodo.title, 'Todo title matches');
  t.equal(
    createdItem.data.description,
    newTodo.description,
    'Todo description matches',
  );
  t.equal(
    createdItem.data.priority,
    newTodo.priority,
    'Todo description matches',
  );
  t.equal(createdItem.data.completed, false, 'Todo is not done yet');

  // Get Todo
  const getResponse = await testApp.inject({
    method: 'GET',
    url: `/todos/${newTodoId}`,
    cookies: { logged_user: loginCookie?.value ?? '' },
  });

  t.equal(getResponse.statusCode, 200, 'Item retrieved successfully');

  const item = JSON.parse(getResponse.payload);

  t.equal(item.data.id, newTodoId, 'Retrieved note ID matches');
  t.equal(item.data.title, newTodo.title, 'Retrieved note title matches');
  t.equal(
    item.data.description,
    newTodo.description,
    'Retrieved note text matches',
  );
  t.equal(item.data.completed, false, 'Todo is not done yet');
});

test('The Update', async t => {
  // Update Note
  const updateInput: Partial<TodoUpdateData> = {
    title: 'WASH THE DISHES NOW!',
    description: 'THE GUESTS ARE COMING!',
    priority: 'HIGH',
  };

  const updateResponse = await testApp.inject({
    method: 'PATCH',
    url: `/todos/${newTodoId}`,
    payload: updateInput,
    cookies: { logged_user: loginCookie?.value ?? '' },
  });

  t.equal(updateResponse.statusCode, 200, 'Note updated successfully');

  // Get Note
  const getUpdatedResponse = await testApp.inject({
    method: 'GET',
    url: `/todos/${newTodoId}`,
    cookies: { logged_user: loginCookie?.value ?? '' },
  });

  t.equal(getUpdatedResponse.statusCode, 200, 'Note retrieved successfully');

  const updatedItem = JSON.parse(getUpdatedResponse.payload)?.['data'];

  t.equal(updatedItem.id, newTodoId, 'Retrieved todo ID matches');
  t.equal(updatedItem.title, updateInput.title, 'Updated todo title matches');
  t.equal(
    updatedItem.description,
    updateInput.description,
    'Updated todo description matches',
  );
  t.equal(
    updatedItem.priority,
    updateInput.priority,
    'Updated todo priority matches',
  );
  t.equal(updatedItem.completed, false, 'Updated todo text matches');
});

test('The Deletion', async t => {
  // Delete Item
  const deleteResponse = await testApp.inject({
    method: 'DELETE',
    url: `/todos/${newTodoId}`,
    cookies: { logged_user: loginCookie?.value ?? '' },
  });

  t.equal(deleteResponse.statusCode, 204, 'Note deleted successfully');

  // Get Todo
  const getUpdatedResponse = await testApp.inject({
    method: 'GET',
    url: `/todos/${newTodoId}`,
    cookies: { logged_user: loginCookie?.value ?? '' },
  });

  t.equal(getUpdatedResponse.statusCode, 404, 'Note does not exist anymore');
});

test('Recency in descending order', async t => {
  const t1: Omit<TodoInsertData, 'user_id'> = {
    title: '1st todo',
    description: 'This is a test item',
    priority: 'LOW',
  };

  const t2: Omit<TodoInsertData, 'user_id'> = {
    title: '2nd todo',
    description: 'This is a test item',
    priority: 'LOW',
  };

  const t3: Omit<TodoInsertData, 'user_id'> = {
    title: '3rd todo',
    description: 'This is a test item',
    priority: 'LOW',
  };

  const inputList: Omit<TodoInsertData, 'user_id'>[] = [t1, t2, t3];
  const titlesOfInputList = inputList.map(i => i.title);

  for(const input of inputList){
    await testApp.inject({
      method: 'POST',
      url: '/todos',
      payload: input,
      cookies: { logged_user: loginCookie?.value ?? '' },
    });

  }

  // Get Notes
  const getResponse = await testApp.inject({
    method: 'GET',
    url: `/todos`,
    cookies: { logged_user: loginCookie?.value ?? '' },
  });

  t.equal(getResponse.statusCode, 200, 'Item retrieved successfully');

  const items = JSON.parse(getResponse.payload)?.['data'];

  t.strictSame(
    items.map((i: Omit<TodoInsertData, 'user_id'>) => i.title),
    titlesOfInputList.reverse(),
    'In the right order'
  );
});

test('Teardown', async t => {
  t.plan(1);

  // Clear up DB
  await helperKnex.migrate.rollback();
  await helperKnex.destroy();
  // Clean up resources and close the server after running the tests
  await testApp.close();

  t.pass('Fastify server teardown complete');
});
