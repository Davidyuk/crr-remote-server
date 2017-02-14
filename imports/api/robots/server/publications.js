import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import { Robots } from '../robots';

Meteor.publish('robots', () => Robots.find({}, { fields: Robots.publicFields }));

Meteor.publish('robots.byId', (robotId) => {
  check(robotId, String);
  return Robots.find(robotId, { fields: Robots.publicFields });
});
