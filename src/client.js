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

  select(db, callback = console.log) {
    this.socket.write(`select ${db}\r\n`, (err) => {
      err && console.log(err);
    });
    this.callbacks.push(callback);
  }

  ping(value = '') {
    this.socket.write(`ping ${value}\r\n`, (err) => {
      err && console.log(err);
    });
    this.callbacks.push(console.log);
  }

  set(key, value, callback) {
    this.socket.write(`set ${key} ${value}\r\n`, (err) => {
      err && console.log(err);
    });
    this.callbacks.push(callback);
  }

  get(key, callback) {
    this.socket.write(`get ${key}\r\n`, (err) => {
      err && console.log(err);
    });
    this.callbacks.push(callback);
  }

  incr(key, callback) {
    this.socket.write(`incr ${key}\r\n`, (err) => {
      err && console.log(err);
    });
    this.callbacks.push(callback);
  }

  lpush(key, value, callback) {
    this.socket.write(`lpush ${key} ${value}\r\n`, (err) => {
      err && console.log(err);
    });
    this.callbacks.push(callback);
  }

  lpop(key, callback) {
    this.socket.write(`lpop ${key}\r\n`, (err) => {
      err && console.log(err);
    });
    this.callbacks.push(callback);
  }

  lrange(key, start, end, callback) {
    this.socket.write(`lrange ${key} ${start} ${end}\r\n`, (err) => {
      err && console.log(err);
    });
    this.callbacks.push(callback);
  }

  rpush(key, value, callback) {
    this.socket.write(`rpush ${key} ${value}\r\n`, (err) => {
      err && console.log(err);
    });
    this.callbacks.push(callback);
  }

  rpop(key, callback) {
    this.socket.write(`rpop ${key}\r\n`, (err) => {
      err && console.log(err);
    });
    this.callbacks.push(callback);
  }

  rpoplpush(src, dest, callback) {
    this.socket.write(`rpoplpush ${src} ${dest}\r\n`, (err) => {
      err && console.log(err);
    });
    this.callbacks.push(callback);
  }

  end() {
    this.socket.end(() => {
      console.log('connection closed...');
    });
  }
}

module.exports = { Client };
