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
        // 'C:\\TEMP\\robot.mp4' 'http://witcoin.ru:8090/feed1.ffm'
        ffmpegProcess = spawn('ffmpeg', ['-i', 'pipe:0', 'http://witcoin.ru:8090/feed1.ffm'], {
          shell: true,
          env: process.env,
          stdio: ['pipe', 'pipe', process.stderr],
        });
        ffmpegProcess.stdout.setEncoding('utf8');
        ffmpegProcess.stdout.on('data', (data) => {
          console.log(`ffmpegProcess: ${String(data)}`);
        });
        ffmpegProcess.on('close', (code) => {
          console.log('process exit code ' + code);
        });
      }
    });

    socket.on('console.clear', () => {
      Robots.update({ socketId }, { $set: { console: [] } });
    });

    socket.on('console', (data) => {
      Robots.update({ socketId }, { $push: { console: data } });
    });

    socket.on('video', (data) => {
      console.log('video', data);
      ffmpegProcess.stdin.write(data);
    });

    socket.on('disconnect', () => {
      Robots.update({ socketId }, { $set: { socketId: '' } });
      ffmpegProcess.stdin.end();
    });
  }));
  io.listen(4000);
});
