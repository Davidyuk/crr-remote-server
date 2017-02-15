/* global process */

import { Meteor } from 'meteor/meteor';
import Server from 'socket.io';
import { spawn } from 'child_process';

import { Robots } from '../robots';

export const io = Server();

Meteor.startup(() => {
  Robots.update({}, { $set: { socketId: '' } }, { multi: true });

  io.on('connection', Meteor.bindEnvironment((socket) => {
    const socketId = socket.id;
    const _on = socket.on;
    Object.assign(socket, {
      on(name, handler, ...args) {
        return _on.call(this, name, Meteor.bindEnvironment(handler), ...args);
      },
    });
    let ffmpegProcess;

    socket.on('auth', (apiAccessToken) => {
      const s = Robots.update({ apiAccessToken }, { $set: { socketId, console: [] } });
      if (s) {
        console.log('Logged in');
      }
    });

    socket.on('console.clear', () => {
      Robots.update({ socketId }, { $set: { console: [] } });
    });

    socket.on('console', (data) => {
      Robots.update({ socketId }, { $push: { console: data } });
    });

    const spawnFfmpegProcess = () => {
      const r = spawn('ffmpeg', ['-i', 'pipe:0', 'http://witcoin.ru:8090/feed1.ffm'], {
        shell: true,
        env: process.env,
        stdio: ['pipe', 'pipe', process.stderr],
      });
      r.stdout.on('data', (data) => {
        console.log(`ffmpegProcess: ${String(data)}`);
      });
      r.on('close', (code) => {
        console.log(`ffmpegProcess exit code ${code}`);
      });
      return r;
    };

    socket.on('video.init', () => {
      Robots.update({ socketId }, { $set: { videoStreamName: '1' } });
      ffmpegProcess = spawnFfmpegProcess();
    });

    socket.on('video.data', (data) => {
      try {
        ffmpegProcess.stdin.write(data);
      } catch (e) {
        console.error(e);
        console.log('Try to run ffmpeg again');
        ffmpegProcess = spawnFfmpegProcess();
        ffmpegProcess.stdin.write(data);
      }
    });

    socket.on('video.end', () => {
      Robots.update({ socketId }, { $unset: { videoStreamName: 1 } });
      if (ffmpegProcess) {
        ffmpegProcess.stdin.end();
      }
    });

    socket.on('disconnect', () => {
      Robots.update({ socketId }, { $unset: { socketId: 1, videoStreamName: 1 } });
    });
  }));
  io.listen(4000);
});
