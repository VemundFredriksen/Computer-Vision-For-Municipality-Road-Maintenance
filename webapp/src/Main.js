import React from 'react';
import { Switch, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';

export default class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false,
    };
  }

  handleLogin = () => {
    this.setState({
      loggedIn: true,
    });
  };

  render() {
    const { loggedIn } = this.state;
    return (
      <main>
        <Switch>
          <Route exact path="/" component={() => <HomePage loggedIn={loggedIn} />} />
          <Route exact path="/login" component={() => <LoginPage loggedIn={loggedIn} handleLogin={this.handleLogin} />} />
        </Switch>
      </main>
    );
  }
}
