import React, { Component } from "react";

// Custom text input
export default class AuthInput extends Component {
  render() {
    return (
      <div className="login-input-container">
        <p className="input-title">{this.props.title}</p>
        <div className="field">
          <input
            className=""
            type={this.props.type}
            value={this.props.text}
            placeholder={this.props.placeholder}
            onChange={this.props.onChange}
            onKeyPress={this.props.onKeyPress}
            {...this.props}
          />
        </div>
      </div>
    );
  }
}