import { Meteor } from 'meteor/meteor';

import { Robots } from './robots/robots';

Meteor.methods({
  'generate.robots': (count = 5) => {
    new Array(count).fill().map((_, id) => Robots.insert({
      apiAccessToken: `test${id}`,
      name: `Test ${id}`,
      videoStreamName: `test${id}`,
    }));
    console.log(Robots.find({}).fetch());
  },
});
