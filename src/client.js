const { parser, getObject } = require('./parser');

class Client {
  constructor(socket) {
    this.socket = socket;
    this.callbacks = [];
  }

  static init(socket, db = 0) {
    const client = new Client(socket);
    client.select(db, () => {});
    client.socket.on('data', (data) => {
      const parsedData = parser(data);
      parsedData.forEach(({ err, res }) => {
        const [callback, resFormatter] = client.callbacks.shift();
        callback(err, resFormatter(res));
      });
    });
    return client;
  }

  write(command, callback, formatter) {
    this.socket.write(`${command}\r\n`, (err) => {
      err && console.log(err);
    });
    this.addCb(callback, formatter);
  }

  addCb(callback, formatter = (res) => res) {
    this.callbacks.push([callback, formatter]);
  }

  select(db, callback = this.print) {
    this.write(`select ${db}`, callback);
  }

  ping(value = '') {
    this.write(`ping ${value}`, this.print);
  }

  set(key, value, callback) {
    this.write(`set ${key} ${value}`, callback);
  }

  get(key, callback) {
    this.write(`get ${key}`, callback);
  }

  del(key, callback) {
    this.write(`del ${key}`, callback);
  }

  keys(pattern, callback) {
    this.write(`keys ${pattern}`, callback);
  }

  incr(key, callback) {
    this.write(`incr ${key}`, callback);
  }

  lpush(key, value, callback) {
    this.write(`lpush ${key} ${value}`, callback);
  }

  lpop(key, callback) {
    this.write(`lpop ${key}`, callback);
  }

  lrange(key, start, end, callback) {
    this.write(`lrange ${key} ${start} ${end}`, callback);
  }

  rpush(key, value, callback) {
    this.write(`rpush ${key} ${value}`, callback);
  }

  rpop(key, callback) {
    this.write(`rpop ${key}`, callback);
  }

  rpoplpush(src, dest, callback) {
    this.write(`rpoplpush ${src} ${dest}`, callback);
  }

  brpop(key,timeout, callback) {
    this.write(`brpop ${key} ${timeout}`, callback);
  }

  hset(key, field, value, callback) {
    this.write(`hset ${key} ${field} ${value}`, callback);
  }

  hget(key, field, callback) {
    this.write(`hget ${key} ${field}`, callback);
  }

  hgetall(key, callback) {
    this.write(`hgetall ${key}`, callback, getObject);
  }

  hmset(key, array, callback) {
    this.write(`hmset ${key} ${array.join(' ')}`, callback);
  }

  hmget(key, fields, callback) {
    this.write(`hmget ${key} ${fields.join(' ')}`, callback);
  }

  flushall(callback) {
    this.write(`flushall`, callback);
  }

  flushdb(callback) {
    this.write(`flushdb`, callback);
  }

  print(err, res) {
    err ? console.error(err) : console.log(res);
  }

  end() {
    if (this.callbacks.length) return setTimeout(this.end.bind(this), 50);
    this.socket.end(() => {
      console.log('connection closed...');
    });
  }
}

module.exports = { Client };
