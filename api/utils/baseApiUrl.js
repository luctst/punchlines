const { apiVersion } = require('@/config');

module.exports = function baseApiUrl(baseUrl) {
  return `/v${apiVersion}${baseUrl || ''}`;
}
