import React from 'react';
import PropTypes from 'prop-types';
import LoginForm from '../components/login/LoginForm';

import './LoginPage.css';

const LoginPage = ({ loggedIn, handleLogin }) => (
  <div className="login__wrapper">
    <h1>Login</h1>
    { loggedIn ? <p>You are logged in</p>
      : <LoginForm handleLogin={handleLogin} /> }
  </div>
);

LoginPage.propTypes = {
  loggedIn: PropTypes.bool.isRequired,
  handleLogin: PropTypes.func.isRequired,
};

export default LoginPage;
