import { afterEach, before, test } from 'node:test';
import { strict as assert } from 'node:assert';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';

import { login, register, verifyOtp } from '../src/controllers/authController';
import User from '../src/models/userModel';
import { chainResult, restoreStubs, runHandler, stubMethod } from './helpers/controllerHarness';

before(() => {
  process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret';
  process.env.COOKIE_EXPIRE = process.env.COOKIE_EXPIRE || '7';
});

afterEach(() => {
  restoreStubs();
});

test('register creates an unverified user and sends a verification code', async () => {
  const sentEmails: any[] = [];
  let savedUser: any;
  let findOneCalls = 0;

  stubMethod(nodemailer as any, 'createTransport', () => ({
    sendMail: async (mail: any) => {
      sentEmails.push(mail);
    },
  }));
  stubMethod(User as any, 'findOne', async () => {
    findOneCalls += 1;
    return null;
  });
  stubMethod((User as any).prototype, 'save', async function save() {
    savedUser = this;
    this._id = 'user-1';
    return this;
  });

  const result = await runHandler(register, {
    body: { name: 'Barbara Gordon', email: 'barbara@example.com', password: 'oracle7' },
  });

  assert.equal(result.statusCode, 201);
  assert.equal(result.body.success, true);
  assert.equal(result.body.user.email, 'barbara@example.com');
  assert.equal(findOneCalls, 2);
  assert.equal(sentEmails.length, 1);
  assert.match(sentEmails[0].subject, /Email Verification Code/);
  assert.equal(savedUser.email, 'barbara@example.com');
  assert.notEqual(savedUser.password, 'oracle7');
  assert.equal(savedUser.accountVerified, false);
  assert.equal(typeof savedUser.verificationCode, 'number');
});

test('verifyOtp marks the newest unverified user as verified and issues a token', async () => {
  const user: any = {
    _id: 'user-2',
    email: 'dick@example.com',
    role: 'user',
    accountVerified: false,
    verificationCode: 12345,
    verificationCodeExpire: new Date(Date.now() + 60_000),
    generateToken: () => 'verified-token',
    save: async function save(options: any) {
      this.saveOptions = options;
      return this;
    },
  };

  stubMethod(User as any, 'find', () => chainResult([user]));

  const result = await runHandler(verifyOtp, {
    body: { email: 'dick@example.com', otp: '12345' },
  });

  assert.equal(result.statusCode, 200);
  assert.equal(result.body.success, true);
  assert.equal(result.body.message, 'Account verified successfully');
  assert.equal(result.body.token, 'verified-token');
  assert.equal(user.accountVerified, true);
  assert.equal(user.verificationCode, undefined);
  assert.equal(user.verificationCodeExpire, undefined);
  assert.deepEqual(user.saveOptions, { validateModifiedOnly: true });
  assert.equal(result.cookies[0].name, 'token');
});

test('login accepts verified credentials and rejects an incorrect password', async () => {
  const hashedPassword = await bcrypt.hash('nightwing', 10);
  const user: any = {
    _id: 'user-3',
    email: 'dick@example.com',
    password: hashedPassword,
    role: 'user',
    accountVerified: true,
    generateToken: () => 'login-token',
  };

  stubMethod(User as any, 'findOne', () => chainResult(user));

  const successfulLogin = await runHandler(login, {
    body: { email: 'dick@example.com', password: 'nightwing' },
  });

  assert.equal(successfulLogin.statusCode, 200);
  assert.equal(successfulLogin.body.message, 'Login successful');
  assert.equal(successfulLogin.body.token, 'login-token');

  const failedLogin = await runHandler(login, {
    body: { email: 'dick@example.com', password: 'wrongpass' },
  });

  assert.equal(failedLogin.statusCode, 404);
  assert.equal(failedLogin.error?.message, 'Invalid email or password');
});

