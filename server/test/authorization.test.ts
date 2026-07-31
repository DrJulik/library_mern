import { test } from 'node:test';
import { strict as assert } from 'node:assert';

import { isAuthorized } from '../src/middlewares/authMiddleware';

test('administrator-only middleware blocks regular users', () => {
  const middleware = isAuthorized('admin');
  let forwardedError: any;

  middleware(
    { user: { role: 'user' } } as any,
    {} as any,
    (error?: any) => {
      forwardedError = error;
    }
  );

  assert.equal(forwardedError.statusCode, 403);
  assert.equal(forwardedError.message, 'You are not authorized to access this resource');
});

test('administrator-only middleware allows administrators', () => {
  const middleware = isAuthorized('admin');
  let nextCalled = false;

  middleware(
    { user: { role: 'admin' } } as any,
    {} as any,
    () => {
      nextCalled = true;
    }
  );

  assert.equal(nextCalled, true);
});

