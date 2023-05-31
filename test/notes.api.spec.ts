import { test } from 'tap';// Read the .env file.
import * as dotenv from "dotenv";

dotenv.config();

import app from '../server'

interface Cookie {
  name: string;
  value: string;
  expires?: Date;
  maxAge?: number;
  secure?: boolean;
  httpOnly?: boolean;
  sameSite?: string;
  [name: string]: unknown
}

let loginCookie: Cookie | undefined;

test('Setup', async (t) => {
  t.plan(1);

  const loginResponse = await app.inject({
    method: 'POST',
    url: '/users/login',
    payload: {
        email: 'sample@text.com',
        password: 'P@ssw0rd'
    },
  });

  loginCookie = loginResponse.cookies.find(i => i.name === 'logged_user');

  t.pass('Fastify server setup complete');
});

test('CRUD Endpoint Tests', async (t) => {
  t.plan(11);

  let newNoteId: string;

  // Create Note
  const newNote = {
    title: 'Test Item',
    text: 'This is a test item',
  };

  const createResponse = await app.inject({
    method: 'POST',
    url: '/notes',
    payload: newNote,
    cookies: { logged_user: loginCookie?.value ?? '' }
  });

  t.equal(createResponse.statusCode, 201, 'Note created!');

  const createdItem = JSON.parse(createResponse.payload);
  newNoteId = createdItem.data.id;

  t.equal(createdItem.data.title, newNote.title, 'Item name matches');
  t.equal(createdItem.data.text, newNote.text, 'Item description matches');

  // Get Note
  const getResponse = await app.inject({
    method: 'GET',
    url: `/notes/${newNoteId}`,
  });

  t.equal(getResponse.statusCode, 200, 'Item retrieved successfully');

  const item = JSON.parse(getResponse.payload);

  t.equal(item.data.id, newNoteId, 'Retrieved item ID matches');
  t.equal(item.data.title, newNote.title, 'Retrieved item name matches');
  t.equal(item.data.text, newNote.text, 'Retrieved item description matches');

  // Update Item
  const updatedItem = {
    name: 'Updated Item',
    description: 'This is an updated item',
  };

  const updateResponse = await app.inject({
    method: 'PUT',
    url: `/notes/${newNoteId}`,
    payload: updatedItem,
  });

  t.equal(updateResponse.statusCode, 200, 'Item updated successfully');

  const updatedItemResponse = JSON.parse(updateResponse.payload);

  t.equal(updatedItemResponse.id, newNoteId, 'Updated item ID matches');
  t.equal(updatedItemResponse.name, updatedItem.name, 'Updated item name matches');
  t.equal(updatedItemResponse.description, updatedItem.description, 'Updated item description matches');

  // Delete Item
  const deleteResponse = await app.inject({
    method: 'DELETE',
    url: `/notes/${newNoteId}`,
  });

  t.equal(deleteResponse.statusCode, 204, 'Item deleted successfully');
});

test('Teardown', async (t) => {
  t.plan(1);

  // Clean up resources and close the server after running the tests
  await app.close();

  t.pass('Fastify server teardown complete');
});
