import React, { Component } from "react";
import DropDownText from './DropDownText';
import FontAwesome from 'react-fontawesome';

export default class Header extends Component {
  filterFavorites = () => {
    return this.props.masterData.filter(recipe => recipe.isFavorite);
  };

  render() {
    return (
      <header>
        <div className="topbar">
          <h1 className="title">
          <FontAwesome name="shopping-basket" />
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