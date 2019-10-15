import React from 'react';

import './LoginForm.css';


export default class LoginForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      password: '',
      usernameError: '',
      passwordError: '',
    };

    this.handleChange = this.handleChange.bind(this);
    this.submitLoginForm = this.submitLoginForm.bind(this);
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
    e.preventDefault();
    if (this.validateForm) {
      this.setState({
        username: '',
        password: '',
        usernameError: '',
        passwordError: '',
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
        <button className="login_button" type="submit">Login</button>
      </form>
    );
  }
}
