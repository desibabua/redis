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

  // client.lpush('numbers', 2, console.log);
  // client.lpush('numbers', 1, console.log);
  // client.rpush('numbers', 3, console.log);
  // client.rpush('numbers', 4, console.log);
  // client.lrange('numbers', '0', '10', console.log);

  // client.rpoplpush('numbers', 'one', console.log);
  // client.lrange('numbers', '0', '10', console.log);
  // client.lrange('one', '0', '10', console.log);

  // client.rpop('numbers', console.log);
  // client.lrange('numbers', '0', '10', console.log);

  // client.ping('new hello');
  // client.set('hello', 'world', console.log);
  // client.get('hello', console.log);
  // client.incr('a', console.log);
  // client.incr('b', console.log);

  // client.keys('*num*', console.log);

  client.hset('animals', 'pet', 'dog', console.log);
  client.hset('animals', 'wild', 'tiger', console.log);
  client.hset('animals', 'reptiles', 'lizard', console.log);

  client.hget('animals', 'pet', console.log);
  client.hget('animals', 'wild', console.log);

  client.hgetall('animals', console.log);

  client.end();
};

main();
