import React, { Component } from "react";
import FontAwesome from 'react-fontawesome';

export default class FAB extends Component {
  render() {
    return (
      <div onClick={this.props.handleFABPress} className="fab" role="button">
        <FontAwesome name="plus" className="my-float" />
      </div>
    );
  }
}