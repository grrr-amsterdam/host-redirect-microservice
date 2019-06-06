// A crude little test suite

const { findTarget } = require('../src/redirect');

// Blank slate
assert(findTarget('www.example.com', []) === undefined);

const redirectRules = [
  {
    origin: 'www.example.com',
    target: 'example.com'
  }
];

assert(findTarget('www.example.com', redirectRules) === 'example.com');
assert(findTarget('example.com', redirectRules) === undefined);

redirectRules.push({ origin: 'www.foobar.com' });

assert(findTarget('www.foobar.com', redirectRules) === undefined);

redirectRules[1].target = 'foobar.com';

assert(findTarget('www.foobar.com', redirectRules) === 'foobar.com');

function assert(statement) {
  if (!statement) {
    throw new Error('Found a false statement');
  }
}
