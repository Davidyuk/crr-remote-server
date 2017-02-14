import React, { PropTypes } from 'react';
import { Link } from 'react-router';

const App = ({ children }) => (
  <div id="layout">
    <header>
      <h2><Link to="/">crr-remote</Link></h2>
    </header>
    {children}
  </div>
);

App.propTypes = {
  children: PropTypes.element.isRequired,
};

export default App;
