import { createServer } from 'net';
import { Meteor } from 'meteor/meteor';

import { Robots } from '../api/robots/robots';
import { processMessage } from './process-message';
import { unpackMessage } from './utils';

export * from './api';

const socks = {};

export const getRobotSocket = (robotId) => {
  if (!socks[robotId]) {
    throw new Error('Socket not found');
  }
  return socks[robotId];
};

Meteor.startup(() => {
  const host = Meteor.settings.robotServerHost || '0.0.0.0';
  const port = Meteor.settings.robotServerPort || 5000;

  Robots.update({}, { $set: { online: false } });

  createServer(Meteor.bindEnvironment((sock) => {
    let robotId = null;
    let buff = '';
    let message;

    sock.setEncoding(null);

    sock.on('data', Meteor.bindEnvironment((data) => {
      [message, buff] = unpackMessage(buff + data);
      if (message === null) return;
      if (robotId) {
        processMessage(robotId, message);
      } else {
        const robot = Robots.findOne({ apiAccessToken: message });
        if (robot) {
          robotId = robot._id;
          Robots.update(robotId, { $set: { online: true } });
        } else {
          sock.end('Invalid api access token');
        }
      }
    }));

    sock.on('close', Meteor.bindEnvironment(() => {
      if (robotId) {
        Robots.update(robotId, { $set: { online: false } });
      }
      delete socks[robotId];
    }));

    sock.on('error', () => { });
  })).listen(port, host);

  console.log(`Robot server listening on ${host}:${port}`);
});
