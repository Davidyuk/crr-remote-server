import { Meteor } from 'meteor/meteor';
import React, { PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { Link } from 'react-router';

import { Robots } from '../../api/robots/robots';

const RobotList = ({ robots }) => (
  <div>
    <h3>RobotList</h3>
    <ul>
      {robots.map(robot => <li key={robot._id}>
        <Link to={`/${robot._id}`}>{robot.name} ({robot.socketId ? 'online' : 'offline'})</Link>
      </li>)}
    </ul>
  </div>
);

RobotList.propTypes = {
  robots: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    socketId: PropTypes.string.isRequired,
  })).isRequired,
};

export default createContainer(() => {
  Meteor.subscribe('robots');
  return {
    robots: Robots.find().fetch(),
  };
}, RobotList);
