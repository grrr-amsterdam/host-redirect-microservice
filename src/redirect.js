/**
 * Redirect from Lambda@Edge from an origin hostname to a target hostname.
 */
const redirectRules = require('../redirect_rules.json');

// Read host from the given Request object
const getHost = request =>
  typeof request.headers.host !== 'undefined' && request.headers.host.length > 0
  ? request.headers.host[0].value
  : undefined;

// Find the redirect target belonging to the given host, or undefined if none exists.
const findTarget = (host, [rule, ...rules], prop = 'target') => typeof rule === 'undefined'
  ? undefined
  : rule.origin === host
    ? rule[prop]
    : findTarget(host, rules, prop);

// Export for testing purposes.
exports.findTarget = findTarget;

// The Lambda handler, based on the AWS Node10 runtime.
exports.handler = async (event) => {
  const request = event.Records[0].cf.request;
  const hostname = getHost(request);
  if (typeof hostname === 'undefined') {
    console.log(`No Host header found for this request`);
    return request;
  }

  const alternativeHostname = findTarget(hostname, redirectRules.rules);
  if (typeof alternativeHostname === 'undefined') {
    console.log(`No alternative hostname found for ${alternativeHostname}`);
    return request;
  }

  const targetCacheLifetime = findTarget(hostname, redirectRules.rules, 'max-age') || 0;

  console.log(`Redirecting ${hostname} to ${alternativeHostname}`);
  return {
    status: '301',
    statusDescription: `Redirecting ${hostname} to ${alternativeHostname}`,
    headers: {
      location: [{
        key: 'Location',
        value: `https://${alternativeHostname}${request.uri}${request.querystring ? '?' + request.querystring : ''}`
      }],
      ['cache-control']: [{
        key: 'Cache-Control',
        value: `max-age=${targetCacheLifetime}`
      }]
    }
  };
};
