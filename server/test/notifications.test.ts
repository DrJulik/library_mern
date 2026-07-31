import { afterEach, test } from 'node:test';
import { strict as assert } from 'node:assert';
import nodemailer from 'nodemailer';

import {
  addNotifyRequest,
  notifyUsersBookAvailable,
  removeNotifyRequest,
} from '../src/controllers/notifyRequestController';
import Book from '../src/models/bookModel';
import NotifyRequest from '../src/models/notifyRequestModel';
import { chainResult, restoreStubs, runHandler, stubMethod } from './helpers/controllerHarness';

afterEach(() => {
  restoreStubs();
});

test('addNotifyRequest creates one availability notification for an unavailable book', async () => {
  const createdRequests: any[] = [];

  stubMethod(Book as any, 'findById', async () => ({
    _id: 'book-5',
    title: 'Cataclysm',
    available: false,
  }));
  stubMethod(NotifyRequest as any, 'findOne', async () => null);
  stubMethod(NotifyRequest as any, 'create', async (payload: any) => {
    createdRequests.push(payload);
    return payload;
  });

  const result = await runHandler(addNotifyRequest, {
    params: { bookId: 'book-5' },
    user: { _id: 'user-5' },
  });

  assert.equal(result.statusCode, 201);
  assert.equal(result.body.success, true);
  assert.equal(result.body.notified, true);
  assert.deepEqual(createdRequests, [{ user: 'user-5', book: 'book-5' }]);
});

test('removeNotifyRequest cleans up a user availability notification', async () => {
  const deletions: any[] = [];

  stubMethod(NotifyRequest as any, 'findOneAndDelete', async (filter: any) => {
    deletions.push(filter);
  });

  const result = await runHandler(removeNotifyRequest, {
    params: { bookId: 'book-6' },
    user: { _id: 'user-6' },
  });

  assert.equal(result.statusCode, 200);
  assert.equal(result.body.message, 'Notification removed');
  assert.equal(result.body.notified, false);
  assert.deepEqual(deletions, [{ user: 'user-6', book: 'book-6' }]);
});

test('notifyUsersBookAvailable emails waiting users and deletes fulfilled requests', async () => {
  const sentEmails: any[] = [];
  const deletedFilters: any[] = [];

  stubMethod(nodemailer as any, 'createTransport', () => ({
    sendMail: async (mail: any) => {
      sentEmails.push(mail);
    },
  }));
  stubMethod(NotifyRequest as any, 'find', () =>
    chainResult([
      { user: { email: 'cass@example.com', name: 'Cass Cain' } },
      { user: { email: 'duke@example.com', name: 'Duke Thomas' } },
    ])
  );
  stubMethod(NotifyRequest as any, 'deleteMany', async (filter: any) => {
    deletedFilters.push(filter);
  });

  await notifyUsersBookAvailable('book-7', "No Man's Land");

  assert.equal(sentEmails.length, 2);
  assert.equal(sentEmails[0].to, 'cass@example.com');
  assert.match(sentEmails[0].subject, /No Man's Land/);
  assert.equal(sentEmails[1].to, 'duke@example.com');
  assert.deepEqual(deletedFilters, [{ book: 'book-7' }]);
});
