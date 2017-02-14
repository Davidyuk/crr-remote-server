import React from 'react';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';

import App from '../../ui/layouts/App.jsx';
import RobotList from '../../ui/pages/RobotList.jsx';
import Robot from '../../ui/pages/Robot.jsx';
import NotFound from '../../ui/pages/NotFound.jsx';

export const renderRoutes = () => (
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={RobotList} />
      <Route path=":robotId" component={Robot} />
      <Route path="*" component={NotFound} />
    </Route>
  </Router>
);
