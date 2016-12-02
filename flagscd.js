#!/usr/bin/env node
'use strict';
const process = require('process');
const child_process = require('child_process');

const io = require('socket.io-client');
const fs = require('mz/fs');

let config = {};

function handle(flag, socket, u) {
  if (!u)
    return;

  if (!flag.flag)
    return;

  const f = u['flags'][flag.flag.name];
  if (!f)
    return;

  if (!flag.flag.enabled)
    return;

  if (f.unset) {
    socket.emit('setFlag', {
      userName: flag.user,
      flagName: flag.flag.name,
      enabled: false,
    });
  }

  if (f.command) {
    child_process.execSync(f.command, {
      stdio: [0, 1, 2],
    });
  }
}

function main() {
  fs.readFile(process.argv[2] || '/etc/flagscd/flagscd.json', 'utf8').then(configJSON => {
    config = JSON.parse(configJSON);
  }).then(() => {
    const defaultName = config['default']['name'];
    for (let serverName in config['servers']) {
      const server = config['servers'][serverName];
      const name = server['name'] || defaultName;
      const socket = io(serverName);
      socket.on('getFlag', flag => handle(flag, socket, server['users'][flag.user]));
      socket.on('setFlag', flag => handle(flag, socket, server['users'][flag.user]));
      socket.on('createFlag', flag => handle(flag, socket, server['users'][flag.user]));

      socket.on('connect', () => {
        socket.emit('name', name);
        for (let user in server['users']) {
          for (let flag in server['users'][user]['flags']) {
            socket.emit('getFlag', {
              userName: user,
              flagName: flag,
            });
          }
        }
      });
    }
  });
}

if (require.main === module)
  main();
