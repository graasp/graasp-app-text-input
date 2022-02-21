import React, { createContext } from 'react';
import PropTypes from 'prop-types';
import Loader from '../common/Loader';
import { hooks } from '../../config/queryClient';
import { showErrorToast } from '../../utils/toasts';

const TokenContext = createContext();

const TokenProvider = ({ children }) => {
  const { data, isLoading, isError } = hooks.useAuthToken();

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    showErrorToast('An error occured while requesting the token.');
  }

  const value = data;
  return (
    <TokenContext.Provider value={value}>{children}</TokenContext.Provider>
  );
};

TokenProvider.propTypes = {
  children: PropTypes.node,
};

TokenProvider.defaultProps = {
  children: null,
};

export { TokenContext, TokenProvider };
