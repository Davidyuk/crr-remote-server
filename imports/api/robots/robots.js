import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

export const Robots = new Mongo.Collection('Robots');

Robots.schema = new SimpleSchema({
  name: String,
  socketId: { type: String, optional: true, defaultValue: '' },
  console: { type: Array, defaultValue: [] },
  'console.$': { type: String, trim: false },
  videoStreamName: String,
  // 'console.$': { type: Object, blackbox: true },
  apiAccessToken: String,
});

Robots.attachSchema(Robots.schema);

Robots.publicFields = {
  name: 1,
  socketId: 1,
  console: 1,
};
