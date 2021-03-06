import _ from 'lodash';
import originalFetch from 'isomorphic-fetch';
import * as C from 'constants/auth';
import { init as initLog } from 'shared/logger';
import {
  getApiUrl,
  retrieveData,
  persistData,
  getTokenFormat,
  getSessionEndpointKey
} from './auth/sessionStorage';

const { debug } = initLog('auth:fetch');

const isApiRequest = (url) => (url.match(getApiUrl(getSessionEndpointKey())));

export const addAuthorizationHeader = (accessToken, headers) => ({
  ...headers,
  Authorization: `Bearer ${accessToken}`
});

const getAuthHeaders = (url) => {
  if (!isApiRequest(url)) {
    return {};
  }
  // fetch current auth headers from storage
  const currentHeaders = retrieveData(C.SAVED_CREDS_KEY) || {};
  const nextHeaders = {};

  // bust IE cache
  nextHeaders['If-Modified-Since'] = 'Mon, 26 Jul 1997 05:00:00 GMT';

  // set header for each key in `tokenFormat` config
  Object.keys(getTokenFormat(), key => {
    nextHeaders[key] = currentHeaders[key];
  });
  return addAuthorizationHeader(currentHeaders['access-token'], nextHeaders);
};

const updateAuthCredentials = (resp) => {
  if (isApiRequest(resp.url)) {
    // set flag to ensure that we don't accidentally nuke the headers
    // if the response tokens aren't sent back from the API
    let blankHeaders = true;
    const newHeaders = {};
    Object.keys(getTokenFormat(), key => {
      newHeaders[key] = resp.headers.get(key);
      if (newHeaders[key]) {
        blankHeaders = false;
      }
    });
    if (!blankHeaders) {
      persistData(C.SAVED_CREDS_KEY, newHeaders);
    }
  }
  return resp;
};


export const parseResponse = (response) => {
  const json = response.json();
  if (response.status >= 200 && response.status < 300) {
    return json;
  }
  return json.then(err => Promise.reject(err.errors ? err.errors : err));
};

export default (url, defaultOptions = {}) => {
  const options = { ...defaultOptions, headers: { ...getAuthHeaders(url) } };
  debug(`Fetching ${url}`, {
    Authorization : options.headers.Authorization,
    headers: _.pickBy(options.headers.headers)
  });
  return originalFetch(url, options)
    .then(resp => {
      debug(`Fetch response: ${resp.status} ${resp.statusText}`);
      if (!_.isEmpty(resp.headers) || !_.isEmpty(resp.body)) {
        debug(_.pick(resp, ['body', 'headers']));
      }
      return updateAuthCredentials(resp);
    });
};
