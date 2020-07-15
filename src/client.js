const { getResponses, formatAsObject } = require('./parser');

class Client {
  constructor(socket) {
    this.socket = socket;
    this.callbacks = [];
  }

  static init(socket, db = 0) {
    const client = new Client(socket);
    client.select(db, () => {});
    client.socket.on('data', (data) => {
      const responses = getResponses(data);
      responses.forEach(({ err, res }) => {
        const [callback, resFormatter] = client.callbacks.shift();
        callback(err, resFormatter(res));
      });
    });
    return client;
  }

  addCb(callback, formatter = (res) => res) {
    this.callbacks.push([callback, formatter]);
  }

  execute(command, callback, formatter) {
    this.socket.write(`${command}\r\n`, (err) => {
      err && console.log(err);
    });
    this.addCb(callback, formatter);
  }

  select(db, callback = this.print) {
    this.execute(`select ${db}`, callback);
  }

  ping(value = '',callback = this.print) {
    this.execute(`ping ${value}`, callback);
  }

  set(key, value, callback) {
    this.execute(`set ${key} ${value}`, callback);
  }

  get(key, callback) {
    this.execute(`get ${key}`, callback);
  }

  del(key, callback) {
    this.execute(`del ${key}`, callback);
  }

  keys(pattern, callback) {
    this.execute(`keys ${pattern}`, callback);
  }

  incr(key, callback) {
    this.execute(`incr ${key}`, callback);
  }

  lpush(key, value, callback) {
    this.execute(`lpush ${key} ${value}`, callback);
  }

  lpop(key, callback) {
    this.execute(`lpop ${key}`, callback);
  }

  lrange(key, start, end, callback) {
    this.execute(`lrange ${key} ${start} ${end}`, callback);
  }

  rpush(key, value, callback) {
    this.execute(`rpush ${key} ${value}`, callback);
  }

  rpop(key, callback) {
    this.execute(`rpop ${key}`, callback);
  }

  rpoplpush(src, dest, callback) {
    this.execute(`rpoplpush ${src} ${dest}`, callback);
  }

  brpop(key,timeout, callback) {
    this.execute(`brpop ${key} ${timeout}`, callback);
  }

  hset(key, field, value, callback) {
    this.execute(`hset ${key} ${field} ${value}`, callback);
  }

  hget(key, field, callback) {
    this.execute(`hget ${key} ${field}`, callback);
  }

  hgetall(key, callback) {
    this.execute(`hgetall ${key}`, callback, formatAsObject);
  }

  hmset(key, array, callback) {
    this.execute(`hmset ${key} ${array.join(' ')}`, callback);
  }

  hmget(key, fields, callback) {
    this.execute(`hmget ${key} ${fields.join(' ')}`, callback);
  }

  flushall(callback) {
    this.execute(`flushall`, callback);
  }

  flushdb(callback) {
    this.execute(`flushdb`, callback);
  }

  print(err, res) {
    err ? console.error(err) : console.log(res);
  }

  end(callback) {
    if (this.callbacks.length) return setTimeout(this.end.bind(this), 50);
    this.socket.end(callback);
  }
}

module.exports = { Client };
