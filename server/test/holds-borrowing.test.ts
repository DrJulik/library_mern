import { afterEach, test } from 'node:test';
import { strict as assert } from 'node:assert';

import { approveHold, placeHold } from '../src/controllers/holdController';
import { recordBorrowedBook, recordReturnedBook } from '../src/controllers/borrowController';
import Book from '../src/models/bookModel';
import Borrow from '../src/models/borrowModel';
import Hold from '../src/models/holdModel';
import NotifyRequest from '../src/models/notifyRequestModel';
import User from '../src/models/userModel';
import { assertError, chainResult, restoreStubs, runHandler, stubMethod } from './helpers/controllerHarness';

afterEach(() => {
  restoreStubs();
});

test('placeHold prevents a duplicate pending or approved hold for the same book', async () => {
  stubMethod(Book as any, 'findById', async () => ({
    _id: 'book-1',
    title: 'The Long Halloween',
    quantity: 2,
    available: true,
  }));
  stubMethod(Hold as any, 'findOne', async () => ({ _id: 'hold-1', status: 'pending' }));

  const result = await runHandler(placeHold, {
    params: { bookId: 'book-1' },
    user: { _id: 'user-1', borrowedBooks: [] },
  });

  assertError(result, 400, 'You already have a hold on this book');
});

test('approveHold reserves inventory and marks the hold approved', async () => {
  const hold: any = {
    _id: 'hold-2',
    user: 'user-2',
    book: 'book-2',
    status: 'pending',
    saveCount: 0,
    save: async function save() {
      this.saveCount += 1;
      return this;
    },
  };
  const book: any = {
    _id: 'book-2',
    title: 'Year One',
    quantity: 1,
    available: true,
    saveCount: 0,
    save: async function save() {
      this.saveCount += 1;
      return this;
    },
  };
  let findByIdCalls = 0;

  stubMethod(Hold as any, 'findById', () => {
    findByIdCalls += 1;
    return findByIdCalls === 1 ? Promise.resolve(hold) : chainResult({ ...hold, book });
  });
  stubMethod(Book as any, 'findById', async () => book);

  const result = await runHandler(approveHold, {
    params: { holdId: 'hold-2' },
    user: { _id: 'admin-1', role: 'admin' },
  });

  assert.equal(result.statusCode, 200);
  assert.equal(result.body.message, 'Hold approved');
  assert.equal(book.quantity, 0);
  assert.equal(book.available, false);
  assert.equal(book.saveCount, 1);
  assert.equal(hold.status, 'approved');
  assert.equal(hold.saveCount, 1);
});

test('recordBorrowedBook fulfills an approved hold without decrementing reserved inventory again', async () => {
  const book: any = {
    _id: 'book-3',
    title: 'Hush',
    quantity: 0,
    available: false,
    saveCount: 0,
    save: async function save() {
      this.saveCount += 1;
      return this;
    },
  };
  const user: any = {
    _id: 'user-3',
    email: 'tim@example.com',
    accountVerified: true,
    borrowedBooks: [],
    saveCount: 0,
    save: async function save() {
      this.saveCount += 1;
      return this;
    },
  };
  const createdBorrows: any[] = [];
  const holdUpdates: any[] = [];

  stubMethod(Book as any, 'findById', async () => book);
  stubMethod(User as any, 'findOne', async () => user);
  stubMethod(Hold as any, 'findOne', async () => ({ _id: 'hold-3', status: 'approved' }));
  stubMethod(Borrow as any, 'create', async (payload: any) => {
    createdBorrows.push(payload);
    return payload;
  });
  stubMethod(Hold as any, 'updateOne', async (filter: any, update: any) => {
    holdUpdates.push({ filter, update });
  });

  const result = await runHandler(recordBorrowedBook, {
    params: { bookId: 'book-3' },
    body: { email: 'tim@example.com' },
    user: { _id: 'admin-1', role: 'admin' },
  });

  assert.equal(result.statusCode, 200);
  assert.equal(result.body.message, 'Book borrowed successfully');
  assert.equal(book.quantity, 0);
  assert.equal(book.saveCount, 0);
  assert.equal(user.saveCount, 1);
  assert.equal(user.borrowedBooks.length, 1);
  assert.equal(user.borrowedBooks[0].bookId, 'book-3');
  assert.equal(createdBorrows.length, 1);
  assert.equal(createdBorrows[0].status, 'borrowed');
  assert.deepEqual(holdUpdates[0].update, { status: 'fulfilled' });
});

test('recordReturnedBook restores inventory and closes the borrow record', async () => {
  const borrowedBook: any = {
    bookId: { toString: () => 'book-4' },
    bookTitle: 'Dark Victory',
    returned: false,
    borrowedDate: new Date(),
    dueDate: new Date(),
  };
  const book: any = {
    _id: 'book-4',
    title: 'Dark Victory',
    quantity: 0,
    available: false,
    saveCount: 0,
    save: async function save() {
      this.saveCount += 1;
      return this;
    },
  };
  const user: any = {
    _id: 'user-4',
    email: 'steph@example.com',
    accountVerified: true,
    borrowedBooks: [borrowedBook],
    saveCount: 0,
    save: async function save() {
      this.saveCount += 1;
      return this;
    },
  };
  const borrow: any = {
    returnDate: null,
    status: 'borrowed',
    saveCount: 0,
    save: async function save() {
      this.saveCount += 1;
      return this;
    },
  };

  stubMethod(Book as any, 'findById', async () => book);
  stubMethod(User as any, 'findOne', async () => user);
  stubMethod(Borrow as any, 'findOne', async () => borrow);
  stubMethod(NotifyRequest as any, 'find', () => chainResult([]));

  const result = await runHandler(recordReturnedBook, {
    params: { bookId: 'book-4' },
    body: { email: 'steph@example.com' },
    user: { _id: 'admin-1', role: 'admin' },
  });

  assert.equal(result.statusCode, 200);
  assert.equal(result.body.message, 'Book returned successfully');
  assert.equal(borrowedBook.returned, true);
  assert.equal(user.saveCount, 1);
  assert.equal(book.quantity, 1);
  assert.equal(book.available, true);
  assert.equal(book.saveCount, 1);
  assert.equal(borrow.status, 'returned');
  assert.ok(borrow.returnDate instanceof Date);
  assert.equal(borrow.saveCount, 1);
});

