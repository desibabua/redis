const parse = function (res) {
  return res.split('\r\n');
};

class Client {
  constructor(socket) {
    this.socket = socket;
    this.callbacks = [];
  }

  static init(socket, db = 0) {
    const client = new Client(socket);
    client.select(db);
    client.socket.on('data', (data) => {
      const parsedData = parse(data);
      parsedData.forEach((res) => {
        const callback = client.callbacks.shift() || console.log;
        callback(res);
      });
    });
    return client;
  }

  select(db) {
    this.socket.write(`select ${db}\r\n`, (err) => {
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

  ping(callback) {
    this.socket.write(`ping\r\n`, (err) => {
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
