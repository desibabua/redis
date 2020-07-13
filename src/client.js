class Client {
  constructor(socket) {
    this.socket = socket;
  }

  set(key, value, callback) {
    this.socket.write(`set ${key} ${value}\r\n`, (err) => {
      err && console.log(err);
    });
    this.socket.once('data', (data) => {
      callback(data);
    });
  }

  get(key, callback) {
    this.socket.write(`get ${key}\r\n`, (err) => {
      err && console.log(err);
    });
    this.socket.once('data', (data) => {
      callback(data);
    });
  }

  end() {
    this.socket.end(() => {
      console.log('connection closed...');
    });
  }
}

module.exports = { Client };
