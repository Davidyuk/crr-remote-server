import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import React, { PropTypes } from 'react';

import { pageWrapper } from '../hocs.jsx';
import { Robots } from '../../api/robots/robots';
import { sendConsole, sendSourceCode } from '../../api/robots/methods';
import Xterm from '../components/Xterm.jsx';

const Robot = ({ robot }) => {
  let userSourceCodeInput;

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', flexDirection: 'row', flexGrow: 1 }}>
        <div style={{ flexGrow: 1 }}>
          <h3>Robot</h3>
          {robot.name} ({robot.socketId ? 'online' : 'offline'})
        </div>
        <div style={{ flexGrow: 1, display: 'flex' }}>
          <video
            src="http://witcoin.ru:8090/test1.webm"
            type='video/webm; codecs="vp8, vorbis"'
            controls autoPlay style={{ margin: 'auto' }}
          />
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'row', flexGrow: 1 }}>
        <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          <textarea
            placeholder="Source code" style={{ flexGrow: 1, margin: '5px', resize: 'none' }}
            ref={(c) => { userSourceCodeInput = c; }}
          />
          <button
            type="button" style={{ margin: '5px' }}
            onClick={() => sendSourceCode.call({
              robotId: robot._id,
              sourceCode: userSourceCodeInput.value,
            })}
          >Run</button>
        </div>
        <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          {/*<textarea
            placeholder="Console output" style={{ flexGrow: 1, margin: '5px', resize: 'none' }} readOnly
            // eslint-disable-next-line no-param-reassign
            ref={(c) => { if (c) { c.scrollTop = c.scrollHeight; } }}
            value={robot.console}
          />*/}
          <Xterm
            style={{ flexGrow: 1, margin: '5px' }}
            data={robot.console}
            onData={(data) => {
              console.warn(data);
              sendConsole.call({ robotId: robot._id, console: data });
            }}
          />
          {/*<input style={{ margin: '5px' }} type="text" ref={(c) => { userConsoleInput = c; }} />
          <button
            type="button" style={{ margin: '5px' }}
            onClick={() => sendConsole.call({ robotId: robot._id, console: userConsoleInput.value })}
          >Send</button>*/}
        </div>
      </div>
    </div>
  );
};

Robot.propTypes = {
  robot: PropTypes.shape({
    name: PropTypes.string.isRequired,
    socketId: PropTypes.string.isRequired,
    // console: PropTypes.string.isRequired,
  }).isRequired,
};

export default createContainer(({ params: { robotId } }) => {
  const loading = !Meteor.subscribe('robots.byId', robotId).ready();
  const robot = Robots.findOne(robotId);
  if (robot) {
    robot.socketId = robot.socketId || '';
    // robot.console = TextDecoder("utf-8").decode(robot.console[1]);
    // console.log(robot.console[1]);
    // console.log(robot.console[0]);
    robot.console = robot.console.join('');
    // console.log(robot.console);
  }
  return {
    robot,
    loading,
    notFound: !robot,
  };
}, pageWrapper(Robot));
