const net = require('net');
const { Client } = require('./client');

const createClient = function ({ db }) {
  const options = { port: 6379, host: 'localhost' };
  const socket = net.createConnection(options, () => {
    console.log('connection established with redis....');
  });
  socket.setEncoding('utf-8');
  return Client.init(socket, db);
};

module.exports = { createClient };
