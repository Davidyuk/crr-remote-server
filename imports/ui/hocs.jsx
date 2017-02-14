import React, { PropTypes } from 'react';

import Loading from './pages/Loading.jsx';
import NotFound from './pages/NotFound.jsx';

export const pageWrapper = (WrappedComponent) => {
  const Wrapper = ({ loading, notFound, ...otherProps }) => {
    if (loading) return <Loading />;
    if (notFound) return <NotFound />;
    return <WrappedComponent {...otherProps} />;
  };

  Wrapper.propTypes = {
    loading: PropTypes.bool.isRequired,
    notFound: PropTypes.bool.isRequired,
  };

  return Wrapper;
};
