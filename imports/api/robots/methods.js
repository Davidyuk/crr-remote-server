import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import SimpleSchema from 'simpl-schema';

const robotApi = Meteor.isServer && require('./server/api');

export const sendSourceCode = new ValidatedMethod({
  name: 'robots.runProgram',
  validate: new SimpleSchema({
    robotId: { type: String },
    sourceCode: { type: String },
  }).validator(),
  run({ robotId, sourceCode }) {
    if (Meteor.server) {
      robotApi.sendSourceCode(robotId, sourceCode);
    }
  },
});

export const sendConsole = new ValidatedMethod({
  name: 'robots.sendConsole',
  validate: new SimpleSchema({
    robotId: { type: String },
    console: { type: String },
  }).validator(),
  run({ robotId, console }) {
    if (Meteor.server) {
      robotApi.sendConsole(robotId, console);
    }
  },
});
