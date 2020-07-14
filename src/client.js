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

  write(command) {
    this.socket.write(`${command}\r\n`, (err) => {
      err && console.log(err);
    });
  }

  addCb(callback, formatter = (res) => res) {
    this.callbacks.push([callback, formatter]);
  }

  select(db, callback = console.log) {
    this.write(`select ${db}`);
    this.addCb(callback);
  }

  ping(value = '') {
    this.write(`ping ${value}`);
    this.addCb(this.print);
  }

  set(key, value, callback) {
    this.write(`set ${key} ${value}`);
    this.addCb(callback);
  }

  get(key, callback) {
    this.write(`get ${key}`);
    this.addCb(callback);
  }

  keys(pattern, callback) {
    this.write(`keys ${pattern}`);
    this.addCb(callback);
  }

  incr(key, callback) {
    this.write(`incr ${key}`);
    this.addCb(callback);
  }

  lpush(key, value, callback) {
    this.write(`lpush ${key} ${value}`);
    this.addCb(callback);
  }

  lpop(key, callback) {
    this.write(`lpop ${key}`);
    this.addCb(callback);
  }

  lrange(key, start, end, callback) {
    this.write(`lrange ${key} ${start} ${end}`);
    this.addCb(callback);
  }

  rpush(key, value, callback) {
    this.write(`rpush ${key} ${value}`);
    this.addCb(callback);
  }

  rpop(key, callback) {
    this.write(`rpop ${key}`);
    this.addCb(callback);
  }

  rpoplpush(src, dest, callback) {
    this.write(`rpoplpush ${src} ${dest}`);
    this.addCb(callback);
  }

  hset(key, field, value, callback) {
    this.write(`hset ${key} ${field} ${value}`);
    this.addCb(callback);
  }

  hget(key, field, callback) {
    this.write(`hget ${key} ${field}`);
    this.addCb(callback);
  }

  hgetall(key, callback) {
    this.write(`hgetall ${key}`);
    this.addCb(callback, getObject);
  }

  print(err, res) {
    err ? console.error(err): console.log(res);
  }

  end() {
    if (this.callbacks.length) return setTimeout(this.end.bind(this), 50);
    this.socket.end(() => {
      console.log('connection closed...');
    });
  }
}

module.exports = { Client };
