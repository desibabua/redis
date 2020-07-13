const net = require('net');
const { Client } = require('./client');

const selectDb = function (client, db = 0) {
  client.write(`select ${db}\r\n`, (err) => {
    err && console.log(err);
  });
};

const createClient = function ({ db }) {
  const options = { port: 6379, host: 'localhost' };
  const socket = net.createConnection(options, () => {
    console.log('connection established with redis....');
  });
  socket.setEncoding('utf-8');
  selectDb(socket, db);
  return new Client(socket);
};

module.exports = { createClient };
