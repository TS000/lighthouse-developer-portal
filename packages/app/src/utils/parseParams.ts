/**
 * Converts a query string from `location.search` into an object and returns it.
 */
export const parseParams = (querystring: string) => {
  // parse query string
  const params = new URLSearchParams(querystring);

  const obj: any = {};

  // iterate over all keys
  for (const key of params.keys()) {
    if (params.getAll(key).length > 1) {
      obj[key] = params.getAll(key);
    } else {
      obj[key] = params.get(key);
    }
  }

  return obj;
};
