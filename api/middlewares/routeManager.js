const parseRouteData = require('parse-route-data');
const baseApiUrl = require('@utils/baseApiUrl')();
const { routes } = require('@/config');
const isObject = require('@utils/isObject');

function formatRoutesForConfig(routesMethodAsObject) {
  const methodsAsKeys = Object.keys(routesMethodAsObject);

  return methodsAsKeys.reduce((prev, current) => {
    const oldPrev = [...prev];
    const newRoutesData = routes[current].map((r) => ({ ...r, method: current }));

    oldPrev.push(...newRoutesData);
    return oldPrev;
  }, []);
}

function generateRoutesConfig(routesConfig) {
  if (!routesConfig || !Array.isArray(routesConfig))
    throw new TypeError(
      'generateRoutesConfig fn must include parameter and must be array'
    );

  const routesConfigFinally = routesConfig.reduce((prev, current) => {
    if (!prev) {
      return {
        [current.method]: {
          [`${baseApiUrl}${current.path}`]: current.data,
        },
      };
    }

    const spreadPrev = { ...prev };
    if (prev[current.method]) {
      spreadPrev[current.method][`${baseApiUrl}${current.path}`] = current.data;
      return prev;
    }

    spreadPrev[current.method] = {};
    spreadPrev[current.method][`${baseApiUrl}${current.path}`] = current.data;
    return spreadPrev;
  }, null);

  return routesConfigFinally;
}

module.exports = function parseRouteManagerWrapper(ops) {
  if (ops) {
    if (!isObject(ops))
      throw new TypeError('parseRouteDataManager fn second parameter must be an object');
  }

  const parseRouteDataOps = {
    envIsDev: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  };

  return parseRouteData(
    generateRoutesConfig(formatRoutesForConfig(routes)),
    null,
    { ...parseRouteDataOps }
  );
};