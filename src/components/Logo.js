import React, { Component } from "react";

export default class Logo extends Component {
  render() {
    return (
      <div className="logo-container">
        <img className="logo" alt="logo" src={this.props.img} />
      </div>
    );
  }
}