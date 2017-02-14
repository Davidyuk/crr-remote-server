/* global document */

import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import { renderRoutes } from '../imports/startup/client/routes.jsx';

Meteor.startup(() => {
  const app = document.createElement('div');
  app.setAttribute('id', 'app');
  document.body.appendChild(app);
  render(renderRoutes(), app);
});
