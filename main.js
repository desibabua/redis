const redis = require('./src/redisClient');

const main = function () {
  const options = { port: 6379, host: 'localhost' };
  const client = redis.createClient(options);
  redis.closeClient(client);
}

main();