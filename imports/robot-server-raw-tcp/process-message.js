import { Robots } from '../api/robots/robots';
import { readTerminatedString } from './utils';

export const processMessage = (robotId, message) => {
  const [name, data] = readTerminatedString(message);
  switch (name) {
    case 'console':
      Robots.update(robotId, { $set: { console: Robots.findOne(robotId).console + data } });
      break;
    case 'video':
      // write to some file
      break;
    default:
      throw new Error('Unknown message name');
  }
};
