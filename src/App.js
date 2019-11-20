import React, { Component } from "react";
import "whatwg-fetch";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { masterData: [], data: [], renderModal: false };
  }

  componentDidMount() {
    fetch("./jsonData_small.json")
      .then(response => {
        return response.json();
      })
      .catch(error => {
        console.log(error.message);
      })
      .then(data => {
        this.setState({ masterData: data.response, data: data.response });
      });
  }

  performSearch = recipes => {
    this.setState({ data: recipes });
  };

  handleFABPress = () => {
    this.setState({ renderModal: true });
  };

  handleFormClose = () => {
    this.setState({ renderModal: false });
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
            {this.state.renderModal ? (
              <FormModal handleFormClose={this.handleFormClose} />
            ) : null}
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
  handleFavoritePress = () => {
    this.setState({ isFavorite: !this.state.isFavorite });
  };

  render() {
    return (
      <div className="form-overlay">
        <form id="recipe-submit" action="" encType="multipart/form-data">
          <div className="form-container">
            <div className="form-elements-container">
              <span onClick={this.props.handleFormClose} className="close">
                X
              </span>
              <h1>Enter A New Recipe!</h1>
              <div className="input-container horizontal center">
                <img
                  onClick={this.handleFavoritePress}
                  className="favoriteIcon"
                  alt="favorite star icon"
                  src={
                    this.state.isFavorite
                      ? require("./img/star-true.png")
                      : require("./img/star-false.png")
                  }
                />
                <p id="favorite-text">Click the Star to Mark a Favorite!</p>
              </div>

              {/* TODO: Input Containers */}
              <InputContainer
                title={"Recipe Name"}
                id={"title"}
                placeholder={"Recipe Title..."}
                aria-label={"Enter Recipe Name"}
                type={"text"}
                multiLine={false}
                required
              />

              <ImageInputContainer/>

              <ListInputContainer
                title={"Ingredients"}
                type={"ingredient"}
                id={"procedure-input"}
                placeholder={"Enter a step..."}
                aria-label={"Enter Steps"}
                required
              />

              {/* <ListInputContainer
                title={"Procedure"}
                type={"procedure"}
                id={"ingredient-input"}
                placeholder={"Enter an Ingredient..."}
                aria-label={"Enter Recipe Ingredient"}
              /> */}

              <InputContainer
                title={"Recipe Description"}
                id={"description"}
                placeholder={"Recipe Description..."}
                aria-label={"Enter Recipe Description"}
                multiLine={true}
                rows={5}
              />

              <InputContainer
                title={"Category"}
                id={"category"}
                placeholder={"Recipe Category..."}
                aria-label={"Enter Recipe Category"}
                type={"text"}
              />

              <InputContainer
                title={"Subcategory"}
                id={"subcategory"}
                placeholder={"Recipe Subcategory..."}
                aria-label={"Enter Recipe Subcategory"}
                type={"text"}
              />

              <InputContainer
                title={"Estimated Time in Minutes"}
                id={"time"}
                placeholder={"Recipe Estimated Time..."}
                aria-label={"Enter Recipe Estimated Time"}
                type={"number"}
              />

              <div className="submit-container">
                <button type="submit" className="btn btn-primary">Submit</button>
              </div>

            </div>
          </div>
        </form>
      </div>
    );
  }
}

class ImageInputContainer extends Component {
  render() {
    return (
      <div className="input-container">
        <p>Upload an Image (Optional)</p>
        <div className="line"></div>
        <div className="box">
          <div className="box-input">
            <input type="file" name="file" id="file" className="input-file" />
            <label htmlFor="file">
              <div className="input-clickable">
                <img className="box-image" alt='upload' src={require("./img/upload.png")} />
                <span>
                  <strong>Choose a file </strong>or drag it here.
                </span>
              </div>
            </label>
          </div>
        </div>
      </div>
    );
  }
}

class ListInputContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {value: '', data: ['ahh', 'ahh2']}
  }

  renderListItems = () => {
    return (
      this.state.data.map((option, i) => {
        return <li key={i} className='list-item'>
          <div className='list-item-contents'>
            <p>{option}<img alt='delete item' src={require("./img/minus.png")}/></p>
          </div>
        </li>
      })
    );
  }

  renderList() {
    if (this.props.type === "ingredient") {
      return (
        <ul>
          {this.renderListItems()}
        </ul>
      );
    } else {
      return (
        <ol>
          {this.renderListItems()}
        </ol>
      );
    }
  }

  submitInput = () => {
    const newData = this.state.data.concat(this.state.value);
    this.setState({value: '', data: newData});
  }

  handleChange = (event) => {
    this.setState({value: event.target.value});
  }

  render() {
    return (
      <div className="input-container">
        <p>
          {this.props.required
            ? this.props.title + " *"
            : this.props.title + " (Optional)"}
        </p>
        <div className="line"></div>
        {this.renderList()}
        <div className="list-input">
          <img
            src={
              this.props.type === "ingredient"
                ? require("./img/shoppingCart.png")
                : require("./img/paperclip.png")
            }
            alt={this.props.type === 'ingredient' ? 'shopping cart' : 'paperclip'}
          />
          <input
            id={this.props.id}
            placeholder={this.props.placeholder}
            aria-label={this.props.ariaLabel}
            type={this.props.type}
            value={this.state.value} 
            onChange={this.handleChange}
          />
          <p onClick={this.submitInput} id="ingredient-add">Add</p>
        </div>
      </div>
    );
  }
}

class InputContainer extends Component {
  render() {
    return (
      <div className="input-container">
        <p>
          {this.props.required
            ? this.props.title + " *"
            : this.props.title + " (Optional)"}
        </p>
        <div className="line"></div>
        {this.props.multiLine ? (
          <textarea
            id={this.props.id}
            className="recipe-description"
            placeholder={this.props.placeholder}
            rows={this.props.rows}
          />
        ) : (
          <input
            id={this.props.id}
            className="standard-input"
            placeholder={this.props.placeholder}
            aria-label={this.props.ariaLabel}
            type={this.props.type}
            {...this.props}
          />
        )}
      </div>
    );
  }
}

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
