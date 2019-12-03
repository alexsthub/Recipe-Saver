import React, { Component } from "react";

export default class DropDownText extends Component {
  constructor(props) {
    super(props);
    this.state = {displayMenu: false};
  }

  showMenu = (event) => {
    event.preventDefault();
    this.setState({ displayMenu: true }, () => {
      document.addEventListener('click', this.closeMenu);
    });
  }

  closeMenu = (event) => {
    console.log('closing');
    if (this.dropdownMenu && !this.dropdownMenu.contains(event.target)) {
      this.setState({ displayMenu: false }, () => {
        document.removeEventListener('click', this.closeMenu);
      });
    }
  }

  render() {
    return (
      <div>
        <p onClick={this.showMenu}>{this.props.user.displayName}</p>
        {this.state.displayMenu ? 
        <div className="menu" ref={(element) => {this.dropdownMenu = element;}}>
          <div onClick={this.props.handleSignOut}>
            <p>Sign Out</p>
          </div>
        </div> : null}
      </div>
    );
  }
}