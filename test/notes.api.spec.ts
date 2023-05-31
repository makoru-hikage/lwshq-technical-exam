import { test } from 'tap';
import { FastifyInstance } from 'fastify';
import * as dotenv from 'dotenv';
import app from '../server';
import {
  testKnexConfig,
  runMigrationAndSeeder,
  knex as helperKnex,
} from './db-config';

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
let newNoteId: string;

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
  // Create Note
  const newNote = {
    title: 'Test Item',
    text: 'This is a test item',
  };

  const createResponse = await testApp.inject({
    method: 'POST',
    url: '/notes',
    payload: newNote,
    cookies: { logged_user: loginCookie?.value ?? '' },
  });

  t.equal(createResponse.statusCode, 201, 'Note created!');

  const createdItem = JSON.parse(createResponse.payload);
  newNoteId = createdItem.data.id;

  t.equal(createdItem.data.title, newNote.title, 'Note title matches');
  t.equal(createdItem.data.text, newNote.text, 'Note text matches');

  // Get Note
  const getResponse = await testApp.inject({
    method: 'GET',
    url: `/notes/${newNoteId}`,
    cookies: { logged_user: loginCookie?.value ?? '' },
  });

  t.equal(getResponse.statusCode, 200, 'Item retrieved successfully');

  const item = JSON.parse(getResponse.payload);

  t.equal(item.data.id, newNoteId, 'Retrieved note ID matches');
  t.equal(item.data.title, newNote.title, 'Retrieved note title matches');
  t.equal(item.data.text, newNote.text, 'Retrieved note text matches');
});

test('The Update', async t => {
  // Update Note
  const updateInput = {
    title: 'Test Item (UPDATED!)',
    text: 'This is an updated item',
  };

  const updateResponse = await testApp.inject({
    method: 'PATCH',
    url: `/notes/${newNoteId}`,
    payload: updateInput,
    cookies: { logged_user: loginCookie?.value ?? '' },
  });

  t.equal(updateResponse.statusCode, 200, 'Note updated successfully');

  // Get Note
  const getUpdatedResponse = await testApp.inject({
    method: 'GET',
    url: `/notes/${newNoteId}`,
    cookies: { logged_user: loginCookie?.value ?? '' },
  });

  t.equal(getUpdatedResponse.statusCode, 200, 'Note retrieved successfully');

  const updatedItem = JSON.parse(getUpdatedResponse.payload)?.['data'];

  t.equal(updatedItem.id, newNoteId, 'Retrieved item ID matches');
  t.equal(updatedItem.title, updateInput.title, 'Updated note title matches');
  t.equal(updatedItem.text, updateInput.text, 'Updated note text matches');
});

test('The Deletion', async t => {
  // Delete Item
  const deleteResponse = await testApp.inject({
    method: 'DELETE',
    url: `/notes/${newNoteId}`,
    cookies: { logged_user: loginCookie?.value ?? '' },
  });

  t.equal(deleteResponse.statusCode, 204, 'Note deleted successfully');

  // Get Note
  const getUpdatedResponse = await testApp.inject({
    method: 'GET',
    url: `/notes/${newNoteId}`,
    cookies: { logged_user: loginCookie?.value ?? '' },
  });

  t.equal(getUpdatedResponse.statusCode, 404, 'Note does not exist anymore');
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
