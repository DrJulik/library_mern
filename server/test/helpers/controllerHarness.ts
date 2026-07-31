import { strict as assert } from 'node:assert';
import { NextFunction, Response } from 'express';

type Handler = (req: any, res: Response, next: NextFunction) => void;

export interface HandlerResult {
  statusCode: number;
  body?: any;
  cookies: Array<{ name: string; value: string; options?: Record<string, unknown> }>;
  error?: Error & { statusCode?: number };
}

export async function runHandler(handler: Handler, req: any): Promise<HandlerResult> {
  return new Promise((resolve, reject) => {
    let settled = false;
    let statusCode = 200;
    const cookies: HandlerResult['cookies'] = [];

    const finish = (result: HandlerResult) => {
      if (!settled) {
        settled = true;
        resolve(result);
      }
    };

    const res = {
      status(code: number) {
        statusCode = code;
        return this;
      },
      cookie(name: string, value: string, options?: Record<string, unknown>) {
        cookies.push({ name, value, options });
        return this;
      },
      json(body: any) {
        finish({ statusCode, body, cookies });
        return this;
      },
    } as unknown as Response;

    const next: NextFunction = (error?: any) => {
      if (error) {
        finish({ statusCode: error.statusCode ?? 500, error, cookies });
        return;
      }

      finish({ statusCode, cookies });
    };

    try {
      handler(req, res, next);
    } catch (error) {
      reject(error);
    }
  });
}

export function assertError(
  result: HandlerResult,
  statusCode: number,
  message: string
): void {
  assert.equal(result.statusCode, statusCode);
  assert.equal(result.error?.message, message);
}

export function chainResult<T>(result: T): any {
  return {
    populate() {
      return this;
    },
    sort() {
      return this;
    },
    select() {
      return this;
    },
    then(resolve: (value: T) => unknown, reject: (reason: unknown) => unknown) {
      return Promise.resolve(result).then(resolve, reject);
    },
  };
}

const restorers: Array<() => void> = [];

export function stubMethod<T extends object, K extends keyof T>(
  target: T,
  key: K,
  replacement: T[K]
): void {
  const original = target[key];
  target[key] = replacement;
  restorers.push(() => {
    target[key] = original;
  });
}

export function restoreStubs(): void {
  while (restorers.length > 0) {
    restorers.pop()!();
  }
}

