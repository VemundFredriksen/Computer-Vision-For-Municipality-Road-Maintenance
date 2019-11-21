import React from 'react';
import PropTypes from 'prop-types';

import './index.css';


export default class LoginForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      password: '',
      usernameError: '',
      passwordError: '',
      error: '',
    };
  }

  handleChange = (e) => {
    if (e.target.name === 'uname') {
      this.setState({
        username: e.target.value,
      });
    }

    if (e.target.name === 'psw') {
      this.setState({
        password: e.target.value,
      });
    }
  };

  submitLoginForm = (e) => {
    const { username, password } = this.state;
    const { handleLogin } = this.props;
    e.preventDefault();
    if (this.validateForm) {
      fetch('https://api.dewp.eu.org/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          password,
        }),
      })
        .then((res) => (
          res.json()
        ))
        .then((data) => {
          if (data.status === 'success') {
            this.setState({
              username: '',
              password: '',
              usernameError: '',
              passwordError: '',
              error: '',
            });
            handleLogin(data.key);
          }
        })
        .catch(() => {
          this.setState({
            username: '',
            password: '',
            usernameError: '',
            passwordError: '',
            error: 'Something went wrong during login. Please try again',
          });
        });
    }
  };

  validateForm = () => {
    const { username, password } = this.state;
    let isValid = true;

    if (username === '') {
      this.setState({
        usernameError: 'Please provide a username',
      });
      isValid = false;
    }

    if (password === '') {
      this.setState({
        passwordError: 'Please provide a password',
      });
      isValid = false;
    }

    return isValid;
  };


  render() {
    const {
      username,
      password,
      usernameError,
      passwordError,
      error,
    } = this.state;

    return (
      <form method="post" className="form" onSubmit={this.submitLoginForm}>
        <div className="login_form__wrapper">
          <span>{usernameError}</span>
          <label className="label">Username</label>
          <input
            className="login_input"
            type="text"
            value={username}
            onChange={this.handleChange}
            placeholder="username"
            name="uname"
            required
          />
          <span>{passwordError}</span>
          <label className="label">Password</label>
          <input
            className="login_input"
            type="password"
            value={password}
            onChange={this.handleChange}
            placeholder="password"
            name="psw"
            required
          />
        </div>
        { error !== '' ? <div>{error}</div> : null }
        <button className="login_button" type="submit">Login</button>
      </form>
    );
  }
}

LoginForm.propTypes = {
  handleLogin: PropTypes.func.isRequired,
};
