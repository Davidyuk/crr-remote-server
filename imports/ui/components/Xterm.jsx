/* global window */

import React, { PropTypes } from 'react';
import Terminal from 'xterm';
import { fit } from 'xterm/dist/addons/fit/fit';
import 'xterm/dist/xterm.css';

class Xterm extends React.Component {
  constructor(props) {
    super(props);
    this.handleResize = this.handleResize.bind(this);
  }

  componentDidMount() {
    const { data, onData } = this.props;

    window.addEventListener('resize', this.handleResize);
    this._term = new Terminal();
    this._term.open(this._node);
    fit(this._term);
    this._term.write(data);

    this._term.on('data', d => onData(d));
  }

  componentDidUpdate() {
    const { data } = this.props;
    // this._term.open(this._node);
    this._term.reset();
    this._term.write(data);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  handleResize() {
    fit(this._term);
  }

  render() {
    const { style, ...otherProps } = this.props;
    delete otherProps.data;
    delete otherProps.onData;
    return (
      <div
        {...otherProps}
        style={{ ...style, backgroundColor: '#000' }}
        ref={(c) => { this._node = c; }}
      />
    );
  }
}

Xterm.propTypes = {
  style: PropTypes.object,
  // data: PropTypes.string,
  onData: PropTypes.func,
};

Xterm.defaultProps = {
  style: {},
  data: '',
  onData: () => {},
};

export default Xterm;
