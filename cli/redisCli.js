const Vorpal = require('vorpal');
const redis = require('../src/redis');
const client = redis.createClient({ db: 1 });

const promised = function (command, args) {
  return new Promise((resolve, reject) => {
    command.bind(client)(...args, (err, res) =>
      err ? reject(err) : resolve(res)
    );
  });
};

const formatArray = function (arr) {
  return arr.map((element, index) => `${index + 1}) "${element}"`).join('\n');
};

const ping = function (vorpal) {
  vorpal.command('ping [text...]').action(function (args, cb) {
    const text = args.text ? args.text.join(' ') : '';
    promised(client.ping, [text]).then(cb).catch(cb);
  });
};

const select = function (vorpal) {
  vorpal.command('select [db]').action(function (args, cb) {
    promised(client.select, [args.db]).then(cb).catch(cb);
    let delimiter = args.db == 0 ? 'redis -> ' : `redis [${args.db}] -> `;
    vorpal.delimiter(delimiter).show();
  });
};

const set = function (vorpal) {
  vorpal.command('set <field> <value>').action(function (args, cb) {
    promised(client.set, [args.field, args.value]).then(cb).catch(cb);
  });
};

const get = function (vorpal) {
  vorpal.command('get <field>').action(function (args, cb) {
    promised(client.get, [args.field]).then(cb).catch(cb);
  });
};

const keys = function (vorpal) {
  vorpal.command('keys <pattern>').action(function (args, cb) {
    promised(client.keys, [args.pattern]).then(formatArray).then(cb).catch(cb);
  });
};

const lpush = function (vorpal) {
  vorpal.command('lpush <list> <value>').action(function (args, cb) {
    promised(client.lpush, [args.list, args.value]).then(cb).catch(cb);
  });
};

const rpush = function (vorpal) {
  vorpal.command('rpush <list> <value>').action(function (args, cb) {
    promised(client.rpush, [args.list, args.value]).then(cb).catch(cb);
  });
};

const lpop = function (vorpal) {
  vorpal.command('lpop <list>').action(function (args, cb) {
    promised(client.lpop, [args.list]).then(cb).catch(cb);
  });
}

const rpop = function (vorpal) {
  vorpal.command('rpop <list>').action(function (args, cb) {
    promised(client.rpop, [args.list]).then(cb).catch(cb);
  });
};

const lrange = function (vorpal) {
  vorpal.command('lrange <list> <start> <end>').action(function (args, cb) {
    promised(client.lrange, [args.list, args.start, args.end]).then(formatArray).then(cb).catch(cb);
  });
};

const rpoplpush = function (vorpal) {
  vorpal.command('rpoplpush <src> <dest>').action(function (args, cb) {
    promised(client.rpoplpush, [args.src, args.dest]).then(cb).catch(cb);
  });
};

const brpop = function (vorpal) {
  vorpal.command('brpop <list> <time>').action(function (args, cb) {
    promised(client.brpop, [args.list, args.time]).then(formatArray).then(cb).catch(cb);
  });
};

const hset = function (vorpal) {
  vorpal.command('hset <key> <field> <value>').action(function (args, cb) {
    promised(client.hset, [args.key, args.field, args.value]).then(cb).catch(cb);
  });
}

const hget = function (vorpal) {
  vorpal.command('hget <key> <field>').action(function (args, cb) {
    promised(client.hget, [args.key, args.field]).then(cb).catch(cb);
  });
}

const hmset = function (vorpal) {
  vorpal.command('hmset <key> [fieldValues...]').action(function (args, cb) {
    promised(client.hmset, [args.key, args.fieldValues]).then(cb).catch(cb);
  });
}

const hmget = function (vorpal) {
  vorpal.command('hmget <key> [fields...]').action(function (args, cb) {
    promised(client.hmget, [args.key, args.fields]).then(formatArray).then(cb).catch(cb);
  });
};

const hgetall = function (vorpal) {
  vorpal.command('hgetall <key>').action(function (args, cb) {
    promised(client.hgetall, [args.key]).then(cb).catch(cb);
  });
};

const flushdb = function (vorpal) {
  vorpal.command('flushdb').action(function (args, cb) {
    promised(client.flushdb, []).then(cb).catch(cb);
  });
};

const flushall = function (vorpal) {
  vorpal.command('flushall').action(function (args, cb) {
    promised(client.flushall, []).then(cb).catch(cb);
  });
};

const startCli = function () {
  const vorpal = new Vorpal();
  vorpal.use(ping);
  vorpal.use(select);
  vorpal.use(set);
  vorpal.use(get);
  vorpal.use(keys);

  vorpal.use(lpush);
  vorpal.use(rpush);
  vorpal.use(lpop);
  vorpal.use(rpop);
  vorpal.use(lrange);
  vorpal.use(rpoplpush);
  vorpal.use(brpop);

  vorpal.use(hset);
  vorpal.use(hget);
  vorpal.use(hmset);
  vorpal.use(hmget);
  vorpal.use(hgetall);

  vorpal.use(flushdb);
  vorpal.use(flushall);

  vorpal.delimiter('redis -> ').show();
};

startCli();
