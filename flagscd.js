#!/usr/bin/env node
'use strict';
const process = require('process');
const child_process = require('child_process');

const io = require('socket.io-client');

const socket = io('http://home.ericchu.net:3000/');

const config = require(process.argv[2] || '/etc/flagscd/flagscd.json');

function handle(flag) {
  const u = config[flag.user];
  if (!u)
    return;

  if (!flag.flag)
    return;

  const f = u[flag.flag.name];
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

socket.on('getFlag', handle);
socket.on('setFlag', handle);
socket.on('createFlag', handle);

socket.on('connect', () => {
  for (let user in config) {
    for (let flag in config[user]) {
      socket.emit('getFlag', {
        userName: user,
        flagName: flag,
      });
    }
  }
});
