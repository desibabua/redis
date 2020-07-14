const redis = require('./src/redis');

const main = function () {
  const client = redis.createClient({ db: 1 });
  client.ping();

  // client.lpush('numbers', 1, client.print);
  // client.lpush('numbers', 2, client.print);
  // client.lpush('numbers', 3, client.print);
  // client.lrange('numbers', '0', '10', client.print);
  // client.lpop('numbers', client.print);
  // client.lrange('numbers', '0', '10', client.print);

  client.lpush('numbers', 2, client.print);
  client.lpush('numbers', 1, client.print);
  client.rpush('numbers', 3, client.print);
  // client.rpush('numbers', 4, client.print);
  // client.lrange('numbers', '0', '10', client.print);

  // client.rpoplpush('numbers', 'one', client.print);
  // client.lrange('numbers', '0', '10', client.print);
  // client.lrange('one', '0', '10', client.print);

  // client.rpop('numbers', client.print);
  // client.lrange('numbers', '0', '10', client.print);

  // client.ping('new hello');
  // client.set('hello', 'world', client.print);
  // client.get('hello', client.print);
  // client.incr('a', client.print);
  // client.incr('b', client.print);

  // client.keys('*num*', client.print);

  // client.hset('animals', 'pet', 'dog', client.print);
  // client.hset('animals', 'wild', 'tiger', client.print);
  // client.hset('animals', 'reptiles', 'lizard', client.print);

  // client.hget('animals', 'pet', client.print);
  // client.hget('animals', 'wild', client.print);

  // const animals = ['pet', 'dog', 'wild', 'tiger', 'reptiles', 'lizard'];
  // client.hmset('animals', animals, client.print);
  // client.hmget('animals', ['pet','wild','reptiles'], client.print);

  // client.hgetall('animals', client.print);
  // client.del('animals', client.print);
  // client.hgetall('animals', client.print);

  // client.keys('*', client.print);
  // client.brpop('numbers', 10, client.print);
  // client.brpop('numbers', 10, client.print);
  // client.brpop('numbers', 10, client.print);
  // client.brpop('numbers', 10, client.print);

  client.flushdb(client.print);
  client.end();
};

main();
