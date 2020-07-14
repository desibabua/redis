const redis = require('./src/redis');

const main = function () {
  const client = redis.createClient({ db: 1 });
  client.ping();

  // client.lpush('numbers', 1, console.log);
  // client.lpush('numbers', 2, console.log);
  // client.lpush('numbers', 3, console.log);
  // client.lrange('numbers', '0', '10', console.log);
  // client.lpop('numbers', console.log);
  // client.lrange('numbers', '0', '10', console.log);

  client.lpush('numbers', 2, console.log);
  client.lpush('numbers', 1, console.log);
  client.rpush('numbers', 3, console.log);
  client.rpush('numbers', 4, console.log);
  client.lrange('numbers', '0', '10', console.log);

  client.rpoplpush('numbers', 'one', console.log);
  client.lrange('numbers', '0', '10', console.log);
  client.lrange('one', '0', '10', console.log);

  client.rpop('numbers', console.log);
  client.lrange('numbers', '0', '10', console.log);

  // client.ping('new hello');
  // client.set('hello', 'world', console.log);
  // client.get('hello', console.log);
  // client.incr('a', console.log);
  // client.incr('b', console.log);
  client.end();
};

main();
