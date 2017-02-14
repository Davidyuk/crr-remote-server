import { Robots } from '../robots';
import { io } from './server';

export const sendSourceCode = (robotId, sourceCode) => {
  io.sockets.sockets[Robots.findOne(robotId).socketId].emit('source-code', sourceCode);
};

export const sendConsole = (robotId, console) => {
  io.sockets.sockets[Robots.findOne(robotId).socketId].emit('console', console);
};
