const redis = require('./src/redis');

const main = function () {
  const client = redis.createClient({ db: 1 });
  client.ping(console.log);
  client.set('hello', 'world', console.log);
  client.get('hello', console.log);
  client.incr('a', console.log);
  client.incr('b', console.log);
  client.end();
};

main();
