import React, { Component } from "react";

export default class FAB extends Component {
  render() {
    return (
      <div onClick={this.props.handleFABPress} className="fab" role="button">
        <i className="fa fa-plus my-float"></i>
      </div>
    );
  }
}