// A crude little test suite

const { findTarget } = require('../src/redirect');

// Blank slate
process.env = {};

assert(findTarget('www.example.com') === undefined);

process.env = {
  REDIRECT_ORIGIN_1: 'www.example.com',
  REDIRECT_TARGET_1: 'example.com'
};

assert(findTarget('www.example.com') === 'example.com');
assert(findTarget('example.com') === undefined);

process.env.REDIRECT_ORIGIN_2 = 'www.foobar.com';

assert(findTarget('www.foobar.com') === undefined);

process.env.REDIRECT_TARGET_2 = 'foobar.com';

assert(findTarget('www.foobar.com') === 'foobar.com');

function assert(statement) {
  if (!statement) {
    throw new Error('Found a false statement');
  }
}
