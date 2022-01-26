import { Search } from 'history';
import { parseParams } from './parseParams';

describe('isLocationMatching', () => {
  let queryString: Search;

  it('return truthy value with valid query string', async () => {
    queryString = '?filters[kind]=system&filters[user]=all';

    expect(Boolean(parseParams(queryString))).toBe(true);
  });

  it('return truthy value with invalid query type', async () => {
    queryString = '';

    expect(Boolean(parseParams(queryString))).toBe(true);
  });

  it('return valid object with valid query string', async () => {
    queryString = '?filters[kind]=system&filters[user]=all';

    const paramsObj = parseParams(queryString);

    expect(paramsObj['filters[kind]']).toBe('system');
    expect(paramsObj['filters[user]']).toBe('all');
  });

  it('return empty object with empty query string', async () => {
    queryString = '';

    const paramsObj = parseParams(queryString);

    expect(Object.keys(paramsObj).length).toBe(0);
  });
});
