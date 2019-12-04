import React, { Component } from "react";
import AuthInput from './AuthInput';
import Logo from './Logo';
import { Button } from "reactstrap";

export default class FrontPage extends Component {
  constructor(props) {
    super(props);
    this.state = { email: "", password: "", username: "", showSignUp: false};
  }

  handleSignUpIn = (event) => {
    event.preventDefault();
    this.setState({showSignUp: !this.state.showSignUp});
  };

  handleInputKeyPress = (event) => {
    if (event.key === 'Enter') {
      if (event.target.type === 'password' && !this.state.showSignUp) {
        this.handleSignIn(event);
      } else if (event.target.type === 'text' && this.state.showSignUp) {
        this.handleSignUp(event);
      }
    }
  }

  handleSignIn = (event) => {
    event.preventDefault();
    this.props.handleSignIn(this.state.email, this.state.password);
  }

  handleSignUp = (event) => {
    event.preventDefault();
    this.props.handleSignUp(this.state.email, this.state.password, this.state.username);
  }

  render() {
    return (
      <div className="login-container">
        <div className="bg-image"></div>
        <div className="login-element-wrapper">
          <Logo img={require('../img/logo_white.png')} />
          {this.props.errorMessage ? <div><p className="error-text">{"*" + this.props.errorMessage}</p></div> : null}
          <form>
          <AuthInput
            type="email"
            title={"Email:"}
            placeholder={'Enter your email...'}
            value={this.state.email}
            onChange={event => this.setState({ email: event.target.value })}
          />

          <AuthInput
            type="password"
            title={"Password:"}
            placeholder={'Enter your password...'}
            autoComplete="on"
            value={this.state.password}
            onKeyPress={this.handleInputKeyPress}
            onChange={event => this.setState({ password: event.target.value })}
          />

          {this.state.showSignUp ? 
            <AuthInput
            type="text"
            title={"Username:"}
            placeholder={'Enter your username...'}
            value={this.state.username}
            onChange={event => this.setState({ username: event.target.value })}
            onKeyPress={this.handleInputKeyPress}
            /> : null
          }

          {!this.state.showSignUp ? 
            <div className="login-button-container">
              <Button onClick={this.handleSignIn} color="primary">Sign In</Button>
              <p className="hyperlink-text" onClick={this.handleSignUpIn}>Don't Have An Account? Sign Up Here!</p>
            </div> : 
            <div className="login-button-container">
              <Button onClick={this.handleSignUp} color="primary">Sign Up</Button>
              <p className="hyperlink-text" onClick={this.handleSignUpIn}>Go Back To Sign In.</p>
            </div>
          }
          </form>
        </div>
      </div>
    );
  }
}