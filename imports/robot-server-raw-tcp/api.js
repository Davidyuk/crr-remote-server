import { getRobotSocket } from './server';
import { packMessage } from './utils';

export const sendSourceCode = (robotId, sourceCode) => {
  const socket = getRobotSocket(robotId);
  socket.write(packMessage(`source-code💩\0${sourceCode}`));
};
