const redis = require('./src/redis');

const main = function () {
  const client = redis.createClient({ db: 1 });
  client.set('hello', 'world', console.log);
  client.get('hello', console.log);
  client.end();
};

main();
