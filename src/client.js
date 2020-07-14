const { parser } = require('./parser');

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
      parsedData.forEach((res) => {
        const callback = client.callbacks.shift();
        callback(res);
      });
    });
    return client;
  }

  write(command) {
    this.socket.write(`${command}\r\n`, (err) => {
      err && console.log(err);
    });
  }

  select(db, callback = console.log) {
    this.write(`select ${db}`);
    this.callbacks.push(callback);
  }

  ping(value = '') {
    this.write(`ping ${value}`);
    this.callbacks.push(console.log);
  }

  set(key, value, callback) {
    this.write(`set ${key} ${value}`);
    this.callbacks.push(callback);
  }

  get(key, callback) {
    this.write(`get ${key}`);
    this.callbacks.push(callback);
  }

  keys(pattern, callback) {
    this.write(`keys ${pattern}`);
    this.callbacks.push(callback);
  }

  incr(key, callback) {
    this.write(`incr ${key}`);
    this.callbacks.push(callback);
  }

  lpush(key, value, callback) {
    this.write(`lpush ${key} ${value}`);
    this.callbacks.push(callback);
  }

  lpop(key, callback) {
    this.write(`lpop ${key}`);
    this.callbacks.push(callback);
  }

  lrange(key, start, end, callback) {
    this.write(`lrange ${key} ${start} ${end}`);
    this.callbacks.push(callback);
  }

  rpush(key, value, callback) {
    this.write(`rpush ${key} ${value}`);
    this.callbacks.push(callback);
  }

  rpop(key, callback) {
    this.write(`rpop ${key}`);
    this.callbacks.push(callback);
  }

  rpoplpush(src, dest, callback) {
    this.write(`rpoplpush ${src} ${dest}`);
    this.callbacks.push(callback);
  }

  hset(key, field, value, callback) {
    this.write(`hset ${key} ${field} ${value}`);
    this.callbacks.push(callback);
  }

  hget(key, field, callback) {
    this.write(`hget ${key} ${field}`);
    this.callbacks.push(callback);
  }

  hgetall(key, callback) {
    this.write(`hgetall ${key}`);
    this.callbacks.push(callback);
  }

  end() {
    if (this.callbacks.length) return setTimeout(this.end.bind(this), 50);
    this.socket.end(() => {
      console.log('connection closed...');
    });
  }
}

module.exports = { Client };
