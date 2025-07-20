/* eslint no-console: 0 */
import Auth from '../api/auth';

const parseErrorCode = error => Promise.reject(error);

export default axios => {
  const { apiHost = '' } = window.chatwootConfig || {};
  const wootApi = axios.create({ baseURL: `${apiHost}/` });

  // Set headers at first load if already logged in
  if (Auth.isLoggedIn()) {
    const {
      'access-token': accessToken,
      'token-type': tokenType,
      client,
      expiry,
      uid,
    } = Auth.getAuthData();
    Object.assign(wootApi.defaults.headers.common, {
      'access-token': accessToken,
      'token-type': tokenType,
      client,
      expiry,
      uid,
    });
  }

  // 🔧 Always add latest token on each request
  wootApi.interceptors.request.use(config => {
    if (Auth.isLoggedIn()) {
      const {
        'access-token': accessToken,
        'token-type': tokenType,
        client,
        expiry,
        uid,
      } = Auth.getAuthData();

      Object.assign(config.headers, {
        'access-token': accessToken,
        'token-type': tokenType,
        client,
        expiry,
        uid,
      });
    }

    return config;
  });

  // Response parsing
  wootApi.interceptors.response.use(
    response => response,
    error => parseErrorCode(error)
  );

  return wootApi;
};
