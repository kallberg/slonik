// @flow

/* eslint-disable flowtype/no-weak-types */

import test from 'ava';
import sinon from 'sinon';
import {
  maybeOneFirst,
  DataIntegrityError
} from '../../src';

test('returns the first row', async (t) => {
  const stub = sinon.stub().returns({
    rows: [
      {
        foo: 1
      }
    ]
  });

  const connection: any = {
    query: stub
  };

  const result = await maybeOneFirst(connection, {}, 'SELECT foo FROM bar');

  t.deepEqual(result, 1);
});

test('returns null if no results', async (t) => {
  const stub = sinon.stub().returns({
    rows: []
  });

  const connection: any = {
    query: stub
  };

  const result = await maybeOneFirst(connection, {}, 'SELECT foo FROM bar');

  t.true(result === null);
});

test('throws an error if more than one row is returned', async (t) => {
  const stub = sinon.stub().returns({
    rows: [
      {
        foo: 1
      },
      {
        foo: 2
      }
    ]
  });

  const connection: any = {
    query: stub
  };

  await t.throws(maybeOneFirst(connection, {}, 'SELECT foo FROM bar'), DataIntegrityError);
});
