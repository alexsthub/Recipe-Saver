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
          <div className="recipe-container">
            <SearchBar />
            <div className="list-container">
              {/* Render the recipes (letter containers) */}
            </div>
            <FAB />
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}

class LetterContainer extends Component {
  render() {
    const letter = this.props.letter;
    return (
      <div id={letter} className='letter-container'>
        <p class='alphabet-letter'>{letter}.</p>
        { /* Render recipe groups */}
      </div>
    )
  }
}

/* commented out for now: probably want to implemented form after everything else is sort of working
class RecipeForm extends Component {
  render() {
    return (
    <div className='form-elements-container'>
      <span className='close'>&times;</span>
      <div className='input-container horizontal center'>
        <img className='favoriteIcon' alt='favorite star icon' src='img/star-false.png' />
        <p id='favorite-text'>Click the Star to Mark a Favorite!</p>
      </div>

      <div className="input-container">
        <p>Recipe Name *</p>
        <div className="line"></div>
        <input id="title" className="standard-input" placeholder="Recipe Title..." aria-label="Enter Recipe Name" type="text" required />
      </div>

      <div className="input-container">
        <p>Upload an Image (Optional)</p>
        <div className="line"></div>
        <div className="box">
          <div className="box-input">
            <input type="file" name="file" id="file" className="input-file" />
            <label for="file">
              <div className="input-clickable">
                <img className="box-image" src="./img/upload.png" />
                <span><strong>Choose a file </strong>or drag it here.</span>
              </div>
            </label>
          </div>
        </div>
      </div>

      <div className="input-container">
        <p>Ingredients *</p>
        <div class="line"></div>
        <ul id="ingredient-list">{insert ingredients here}</ul>
        <div className="list-input">
          <img src="./img/shoppingCart.png" />
          <input id="ingredient-input" placeholder="Enter an Ingredient..."
            aria-label="Enter Recipe Ingredient" type="text" />
          <p id="ingredient-add">Add</p>
        </div>
      </div>

      <div className="input-container">
        <p>Procedure *</p>
        <div className="line"></div>
        <ol id="procedure-list">{insert procedure here}</ol>
        <div class="list-input">
          <img src="./img/paperclip.png" />
          <input id="procedure-input" placeholder="Enter a Step..." aria-label="Enter Steps" type="text" />
          <p id="procedure-add">Add</p>
        </div>
      </div>

      <div className="input-container">
        <p>Recipe Description (Optional)</p>
        <div className="line"></div>
        <textarea id="description" placeholder="Recipe Description..." rows="5" className="recipe-description"></textarea>
      </div>

      <div className="input-container">
        <p>Category (Optional)</p>
        <div className="line"></div>
        <input id="category" class="standard-input" placeholder="Recipe Category..." aria-label="Enter Recipe Category" type="text" />
      </div>

      <div className="input-container">
        <p>Subcategory (Optional)</p>
        <div class="line"></div>
        <input id="subcategory" className="standard-input" placeholder="Recipe Subcategory..." aria-label="Enter Recipe Subcategory" type="text" />
      </div>

      <div className="input-container">
        <p>Estimated Time in Minutes(Optional)</p>
        <div className="line"></div>
        <input id="time" type="number" className="standard-input" placeholder="Recipe Estimated Time..." aria-label="Enter Recipe Estimated Time" type="text" />
      </div>

      <div className="submit-container">
        <button type="submit" className="btn btn-primary">Submit</button>
      </div>

    </div>
    )
  }
}
*/

class Recipe extends Component {
  render() {
    const recipe = this.props.recipe;
    return (
      <div className="recipe-group">
        <div className="recipe-letter-container">
          <div className="recipe">
            <img
              className="foodimage"
              alt={`${recipe.imageName ? recipe.imageName : "recipe saver logo"}`}
              src={`${
                recipe.imageName
                  ? recipe.imageName.startsWith("blob")
                    ? recipe.imageName
                    : "./recipeImages/" + recipe.imageName
                  : "./recipeImages/default.jpg"
                }`}
            />
            <div className="recipe-info">
              <div className="title-container">
                <p className="recipe-title">${recipe.title}</p>
                <img
                  className="favoriteIcon"
                  alt="favorite star icon"
                  src={`img/${recipe.isFavorite ? 'star-true' : 'star-false'}.png`}
                />
              </div>
              <p className="recipe-description">{recipe.description ? recipe.description : "Add a description!"}</p>
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
      <div className="recipe-details">
        <div className="ingredients">
          <h2>Ingredients:</h2>
          <ul>
            {ingredients.map((ingredient) => {
              return <li>{ingredient}</li>
            })}
          </ul>
        </div>
        <div className="directions-container">
          <h2>Directions:</h2>

          {recipe.estimatedTime ?
            <div className="time">
              <i className="fa fa-clock-o" aria-hidden="true"></i> ${toTimeString(recipe.estimatedTime)}
            </div> : null}

          <div className="directions">
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

class LetterContainer extends Component {

}

export default App;
