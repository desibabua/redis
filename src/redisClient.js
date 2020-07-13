const net = require('net');

const createClient = function (options) {
  const client = net.createConnection(options, () => {
    console.log('connection established with redis....');
  });
  client.setEncoding('utf-8');
  return client;
};

const closeClient = function (client) {
  client.end(() => {
    console.log('connection closed...');
  });
};

module.exports = { createClient, closeClient };
