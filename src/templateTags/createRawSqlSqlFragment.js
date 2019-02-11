// @flow

import type {
  RawSqlTokenType,
  SqlFragmentType
} from '../types';
import {
  UnexpectedStateError
} from '../errors';

export default (token: RawSqlTokenType, greatestParameterPosition: number): SqlFragmentType => {
  let sql = '';

  let leastMatchedParameterPosition = Infinity;
  let greatestMatchedParameterPosition = 0;

  sql += token.sql.replace(/\$(\d+)/g, (match, g1) => {
    const parameterPosition = parseInt(g1, 10);

    if (parameterPosition > greatestMatchedParameterPosition) {
      greatestMatchedParameterPosition = parameterPosition;
    }

    if (parameterPosition < leastMatchedParameterPosition) {
      leastMatchedParameterPosition = parameterPosition;
    }

    return '$' + (parameterPosition + greatestParameterPosition);
  });

  if (greatestMatchedParameterPosition > token.values.length) {
    throw new UnexpectedStateError('The greatest parameter position is greater than the number of parameter values.');
  }

  if (leastMatchedParameterPosition !== Infinity && leastMatchedParameterPosition !== 1) {
    throw new UnexpectedStateError('Parameter position must start at 1.');
  }

  return {
    parameters: token.values,
    sql
  };
};
