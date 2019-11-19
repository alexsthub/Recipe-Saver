import React, { Component } from "react";
import "whatwg-fetch";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { masterData: [], data: [], renderModal: false };
  }

  componentDidMount() {
    fetch('./jsonData_small.json')
    .then((response) => {
      return response.json();
    })
    .catch((error) => {
      console.log(error.message);
    })
    .then((data) => {
      this.setState({ masterData: data.response, data: data.response });
    })
  }

  performSearch = recipes => {
    this.setState({ data: recipes });
  };

  handleFABPress = () => {
    this.setState({ renderModal: true });
  };

  render() {
    let recipes = this.state.data;
    let recipeDict = {};
    if (recipes) {
      recipes.forEach(recipe => {
        const firstLetter = recipe.title.charAt(0).toUpperCase();
        if (firstLetter in recipeDict) {
          recipeDict[firstLetter].push(recipe);
        } else {
          recipeDict[firstLetter] = [recipe];
        }
      });
    }
    const sortedKeys = Object.keys(recipeDict).sort();
    return [
      <Header />,
      <main>
        <div className="search-page">
          <Logo />
          <div className="recipe-container">
            <SearchBar
              masterData={this.state.masterData}
              parentCallback={this.performSearch}
            />
            <div className="list-container">
              {sortedKeys.map(letter => {
                const recipes = recipeDict[letter].sort();
                return (
                  <LetterContainer
                    key={letter}
                    letter={letter}
                    recipes={recipes}
                  />
                );
              })}
            </div>
            {this.state.renderModal ? <FormModal /> : null}
            <FAB handleFABPress={this.handleFABPress} />
          </div>
        </div>
      </main>,
      <Footer />
    ];
  }
}

class FormModal extends Component {
  constructor(props) {
    super(props);
    this.state = { isFavorite: false };
  }

  // TODO: Handle onPress here
  handleFavoritePress = () => {};

  render() {
    return (
      <div className="form-overlay">
        <form id="recipe-submit" action="" enctype="multipart/form-data">
          <div class="form-container">
            <div className="form-elements-container">
              <span className="close">X</span>
              <div className="input-container horizontal center">
                <img onClick={this.handleFavoritePress} className="favoriteIcon" alt="favorite star icon" src={require("./img/star-false.png")}/>
                <p id="favorite-text">Click the Star to Mark a Favorite!</p>
              </div>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

/* commented out for now: probably want to implemented form after everything else is sort of working
class RecipeForm extends Component {
  render() {
    return (
    <div className='form-elements-container'>

      <div className='input-container'>
        <p>Recipe Name *</p>
        <div className='line'></div>
        <input id='title' className='standard-input' placeholder='Recipe Title...' aria-label='Enter Recipe Name' type='text' required />
      </div>

      <div className='input-container'>
        <p>Upload an Image (Optional)</p>
        <div className='line'></div>
        <div className='box'>
          <div className='box-input'>
            <input type='file' name='file' id='file' className='input-file' />
            <label for='file'>
              <div className='input-clickable'>
                <img className='box-image' src={require('./img/upload.png')} />
                <span><strong>Choose a file </strong>or drag it here.</span>
              </div>
            </label>
          </div>
        </div>
      </div>

      <div className='input-container'>
        <p>Ingredients *</p>
        <div class='line'></div>
        <ul id='ingredient-list'>{insert ingredients here}</ul>
        <div className='list-input'>
          <img src={require('./img/shoppingCart.png')} />
          <input id='ingredient-input' placeholder='Enter an Ingredient...'
            aria-label='Enter Recipe Ingredient' type='text' />
          <p id='ingredient-add'>Add</p>
        </div>
      </div>

      <div className='input-container'>
        <p>Procedure *</p>
        <div className='line'></div>
        <ol id='procedure-list'>{insert procedure here}</ol>
        <div class='list-input'>
          <img src={require('./img/paperclip.png')} />
          <input id='procedure-input' placeholder='Enter a Step...' aria-label='Enter Steps' type='text' />
          <p id='procedure-add'>Add</p>
        </div>
      </div>

      <div className='input-container'>
        <p>Recipe Description (Optional)</p>
        <div className='line'></div>
        <textarea id='description' placeholder='Recipe Description...' rows='5' className='recipe-description'></textarea>
      </div>

      <div className='input-container'>
        <p>Category (Optional)</p>
        <div className='line'></div>
        <input id='category' class='standard-input' placeholder='Recipe Category...' aria-label='Enter Recipe Category' type='text' />
      </div>

      <div className='input-container'>
        <p>Subcategory (Optional)</p>
        <div class='line'></div>
        <input id='subcategory' className='standard-input' placeholder='Recipe Subcategory...' aria-label='Enter Recipe Subcategory' type='text' />
      </div>

      <div className='input-container'>
        <p>Estimated Time in Minutes(Optional)</p>
        <div className='line'></div>
        <input id='time' type='number' className='standard-input' placeholder='Recipe Estimated Time...' aria-label='Enter Recipe Estimated Time' type='text' />
      </div>

      <div className='submit-container'>
        <button type='submit' className='btn btn-primary'>Submit</button>
      </div>

    </div>
    )
  }
}
*/

class LetterContainer extends Component {
  render() {
    return (
      <div id={this.props.letter} className="letter-container">
        <p className="alphabet-letter">{this.props.letter}.</p>
        {this.props.recipes.map(recipe => {
          return <Recipe key={recipe.title} recipe={recipe} />;
        })}
      </div>
    );
  }
}

// TODO: Pass in onFavoriteClick method.
class Recipe extends Component {
  constructor(props) {
    super(props);
    this.state = { displayDetails: false, isFavorite: props.recipe.isFavorite };
  }

  toggleFavorite = () => {
    this.setState(currentState => {
      console.log(!currentState.isFavorite);
      return { isFavorite: !currentState.isFavorite };
    });
  };

  render() {
    const recipe = this.props.recipe;
    return (
      <div className="recipe-group">
        <div className="recipe-letter-container">
          <div className="recipe">
            <img
              className="foodimage"
              alt={`${
                recipe.imageName ? recipe.imageName : "recipe saver logo"
              }`}
              src={require(`${
                recipe.imageName
                  ? recipe.imageName.startsWith("blob")
                    ? recipe.imageName
                    : "./recipeImages/" + recipe.imageName
                  : "./recipeImages/default.jpg"
              }`)}
            />
            <div className="recipe-info">
              <div className="title-container">
                <p className="recipe-title">{recipe.title}</p>
                <img
                  className="favoriteIcon"
                  alt="favorite star icon"
                  src={
                    this.isFavorite
                      ? require("./img/star-true.png")
                      : require("./img/star-false.png")
                  }
                  onClick={this.toggleFavorite}
                />
              </div>
              <p className="recipe-description">
                {recipe.description ? recipe.description : "Add a description!"}
              </p>
              <p>Category: {recipe.category ? recipe.category : "none"}</p>
              <p>
                Subcategory: {recipe.subcategory ? recipe.subcategory : "none"}
              </p>
            </div>
          </div>
        </div>
        {/* <RecipeDetails/> */}
      </div>
    );
  }
}

class RecipeDetails extends Component {
  toTimeString(min) {
    if (min <= 60) {
      return min + " min";
    } else if (min < 120) {
      return Math.floor(min / 60) + " hr " + (min % 60) + " min";
    } else {
      return Math.floor(min / 60) + " hrs " + (min % 60) + " min";
    }
  }

  render() {
    const recipe = this.props.recipe;
    let ingredients = recipe.ingredients.split("|");
    let procedure = recipe.procedure.split("|");
    if (this.props.displayDetails) {
      return (
        <div className="recipe-details">
          <div className="ingredients">
            <h2>Ingredients:</h2>
            <ul>
              {ingredients.map(ingredient => {
                return <li>{ingredient}</li>;
              })}
            </ul>
          </div>
          <div className="directions-container">
            <h2>Directions:</h2>

            {recipe.estimatedTime ? (
              <div className="time">
                <i className="fa fa-clock-o" aria-hidden="true"></i> $
                {this.toTimeString(recipe.estimatedTime)}
              </div>
            ) : null}

            <div className="directions">
              <ol>
                {procedure.map(step => {
                  return <li>{step}</li>;
                })}
              </ol>
            </div>
          </div>
        </div>
      );
    } else {
      return;
    }
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
        <img className="logo" alt="logo" src={require("./img/logo.png")} />
      </div>
    );
  }
}

class SearchBar extends Component {
  constructor(props) {
    super(props);
    this.state = { value: "" };
  }

  handleChange = event => {
    let newVal = event.target.value;
    if (newVal === "") {
      this.setState({ value: newVal });
      this.props.parentCallback(this.props.masterData);
    } else {
      this.setState({ value: newVal });
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
    }
  };

  handleSubmit = event => {
    event.preventDefault();
    this.props.parentCallback(this.searchRecipes(this.state.value));
    console.log("submit handled: " + this.state.value);
  };

  // function searches for recipes given target string
  searchRecipes(target) {
    return this.props.masterData.filter(x =>
      x.title.toLowerCase().includes(target.toLowerCase())
    );
  }

  render() {
    return (
      <form className="search-bar">
        <input
          className="search"
          placeholder="Search for a recipe..."
          aria-label="Search for items"
          type="search"
          value={this.state.value}
          onChange={this.handleChange}
          required
        />
        <button
          className="search-button"
          aria-label="search button"
          onClick={this.handleSubmit}
        >
          <i className="fa fa-search-plus" />
        </button>
      </form>
    );
  }
}

class FAB extends Component {
  render() {
    return (
      <div onClick={this.props.handleFABPress} className="fab">
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
            alt="fruits"
            src={require("./img/fruit_banner.png")}
          />
        </div>
      </footer>
    );
  }
}

export default App;
