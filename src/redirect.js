/**
 * Redirect from Lambda@Edge from an origin hostname to a target hostname.
 */

// Read host from the given Request object
const getHost = request =>
  typeof request.headers.host !== 'undefined' && request.headers.host.length > 0
  ? request.headers.host[0].value
  : undefined;

// Find the redirect target belonging to the given host, or undefined if none exists.
const findTarget = (host, n = 1) => typeof process.env[`REDIRECT_ORIGIN_${n}`] === 'undefined'
  ? undefined
  : process.env[`REDIRECT_ORIGIN_${n}`] === host
    ? process.env[`REDIRECT_TARGET_${n}`]
    : findTarget(host, n + 1);

// Export for testing purposes.
exports.findTarget = findTarget;

// The Lambda handler, based on the AWS Node10 runtime.
exports.handler = async (event) => {
  const request = event.Records[0].cf.request;
  const hostname = getHost(request);
  if (typeof hostname === 'undefined') {
    return request;
  }

  const alternativeHostname = findTarget(hostname);
  if (typeof alternativeHostname === 'undefined') {
    return request;
  }

  request.headers.host[0].value = alternativeHostname;
  return request;
};
