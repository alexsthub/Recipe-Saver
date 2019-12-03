import React, { Component } from "react";
import DropDownText from './DropDownText';

// TODO: Username isn't showing on sign up
export default class Header extends Component {
  filterFavorites = () => {
    return this.props.masterData.filter(recipe => recipe.isFavorite);
  };

  render() {
    return (
      <header>
        <div className="topbar">
          <h1 className="title">
            <i className="fa fa-shopping-basket" aria-hidden="true"></i>
          </h1>
          <div className="nav">
            <p
              className={this.props.favorite ? "" : "selected"}
              role="button"
              onClick={() => {
                this.props.parentCallback(this.props.masterData, false);
              }}
            >
              All
            </p>
            <p
              className={this.props.favorite ? "selected" : ""}
              role="button"
              onClick={() => {
                this.props.parentCallback(this.filterFavorites(), true);
              }}
            >
              Favorites
            </p>
          </div>
          <div className="user-container">
            <DropDownText 
              user={this.props.user}
              handleSignOut={this.props.handleSignOut}/>
          </div>
        </div>
      </header>
    );
  }
}