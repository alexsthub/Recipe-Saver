import React, { Component } from "react"; //import React Component

class App extends Component {
  render() {
    return (
      <div>
        <Header />
        <div className="search-page">
          <Logo />
          <div class="recipe-container">
            <SearchBar />
            <div className="list-container">
              {/* Render the recipes */}
            </div>
            <FAB />
          </div>
        </div>
      </div>
    );
  }
}

class Header extends Component {
  render() {
    return (
      <header>
        <div className="topbar">
          <h1 className="title">
            <i className="fa fa-shopping-basket" aria-hidden="true"></i>
          </h1>
          <div className="nav">
            <p className="all selected">All</p>
            <p className="favorite">Favorites</p>
          </div>
          <div className="user-container">
            <p>User123456</p>
          </div>
        </div>
      </header>
    );
  }
}

class Logo extends Component {
  render() {
    return (
      <div className="logo-container">
        <img className="logo" alt="logo" src="img/logo.png" />
      </div>
    );
  }
}

class SearchBar extends Component {
  render() {
    return (
      <form>
        <input
          className="search"
          placeholder="Search for a recipe..."
          aria-label="Search for items"
          type="search"
          required
        />
        <button className="search-button" aria-label="search button">
          <i className="fa fa-search-plus" />
        </button>
      </form>
    );
  }
}

class FAB extends Component {
  render() {
    return (
      <div className="fab">
        <i className="fa fa-plus my-float"></i>
      </div>
    );
  }
}

class Footer extends Component {
  render() {
    return (
      <footer>
        <div className="footer-text">
          <p>Recipe Saver Inc. 2019&copy;</p>
          <p>Made by: Alex Tan and Jerry Lin</p>
          <address>
            <p>
              For any questions or concerns, contact us at{" "}
              <a href="mailto:alexst@uw.edu">alexst@uw.edu</a>, or at{" "}
              <a href="tel:360-123-4567">(360) 123-4567</a>.
            </p>
          </address>
        </div>
        <div className="footer-image-container">
          <img
            className="footer-img"
            alt="fruits image"
            src="img/fruit_banner.png"
          />
        </div>
      </footer>
    );
  }
}

export default App;
