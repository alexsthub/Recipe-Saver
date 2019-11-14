import React, { Component } from "react"; 
import 'whatwg-fetch';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { data: null };
  }

  componentDidMount() {
    // Fetch data here
  }

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
        <Footer />
      </div>
    );
  }
}

class Recipe extends Component {
  render() {
    const recipe = this.props.recipe;
    return (
      <div class="recipe-group">
        <div class="recipe-letter-container">
          <div class="recipe">
            <img
              class="foodimage"
              alt={`${recipe.imageName ? recipe.imageName : "recipe saver logo"}`}
              src={`${
                recipe.imageName
                  ? recipe.imageName.startsWith("blob")
                    ? recipe.imageName
                    : "./recipeImages/" + recipe.imageName
                  : "./recipeImages/default.jpg"
              }`}
            />
            <div class="recipe-info">
              <div class="title-container">
                <p class="recipe-title">${recipe.title}</p>
                <img
                  class="favoriteIcon"
                  alt="favorite star icon"
                  src={`img/${recipe.isFavorite ? 'star-true' : 'star-false'}.png`}
                />
              </div>
              <p class="recipe-description">{recipe.description ? recipe.description : "Add a description!"}</p>
              <p>Category: ${recipe.category ? recipe.category : "none"}</p>
              <p>Subcategory: ${recipe.subcategory ? recipe.subcategory : "none"}</p>
            </div>
          </div>
        </div>
        <RecipeDetails />
      </div>
    );
  }
}

class RecipeDetails extends Component {
  render() {
    const recipe = this.props.recipe;
    let ingredients = recipe.ingredients.split("|");
    let procedure = recipe.procedure.split("|");
    return (
      <div class="recipe-details">
        <div class="ingredients">
          <h2>Ingredients:</h2>
          <ul>
            {ingredients.map((ingredient) => {
              return <li>{ingredient}</li>
            })}
          </ul>
        </div>
        <div class="directions-container">
          <h2>Directions:</h2>

          {recipe.estimatedTime ? 
          <div class="time"> 
            <i class="fa fa-clock-o" aria-hidden="true"></i> ${toTimeString(recipe.estimatedTime)}
          </div>: null}

          <div class="directions">
            <ol>
              {procedure.map((step) => {
                return <li>{step}</li>
              })}
            </ol>
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
