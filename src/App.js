import React, { Component } from "react";
import "whatwg-fetch";
import firebase from "firebase/app";
import FontAwesome from 'react-fontawesome';

import Logo from './components/Logo';
import FrontPage from './components/FrontPage';
import Header from './components/Header';
import FormModal from './components/FormModal';
import FAB from './components/FAB';
import Footer from './components/Footer';

// TODO: Username isn't showing on sign up (Not a huge deal)
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      masterData: [],
      data: [],
      renderModal: false,
      favorites: false,
      user: null,
      errorMessage: null,
      loading: true
    };
  }

  // Check for user and load data
  componentDidMount() {
    this.authUnRegFunc = firebase.auth().onAuthStateChanged((currentUser) => {
      if (currentUser) {
        this.recipeRef = firebase.database().ref(currentUser.uid);
        this.recipeRef.on('value', (snapshot) => {
          const recipeObj = snapshot.val();
          if (recipeObj) {
            let recipes = [];
            Object.keys(recipeObj).forEach((key) => {
              const obj = recipeObj[key];
              recipes.push(obj);
            })
            this.setState({user: currentUser, loading: false, masterData: recipes, data: recipes});
          } else {
            this.setState({user: currentUser, loading: false, masterData: [], data: []});
          }
        })
      } else {
        this.setState({user: null, loading: false})
      }
    })
  }

  // Firebase Auth
  componentWillUnmount() {
    this.authUnRegFunc()
  }

  // Firebase Auth: Sign In
  handleSignIn = (email, password) => {
    this.setState({errorMessage:null});
    firebase.auth().signInWithEmailAndPassword(email, password)
    .catch((error) => {
      this.setState({errorMessage: error.message, loading: false})
    })
  }

  // Firebase Auth: Sign Up
  handleSignUp = (email, password, username) => {
    this.setState({errorMessage:null, loading: true});
    firebase.auth().createUserWithEmailAndPassword(email, password)
    .then((userCredentials) => {
      let user = userCredentials.user
      return user.updateProfile({
        displayName: username,
      })
    })
    .catch((error) => {
      this.setState({errorMessage: error.message})
    })
  }

  // Firebase Auth: Sign Out
  handleSignOut = () => {
    this.setState({errorMessage:null}); 
    firebase.auth().signOut()
    .catch((error) => {
      this.setState({errorMessage: error.message})
    })
  }

  performSearch = recipes => {
    this.setState({ data: recipes });
  };

  displayFavorites = (recipes, status) => {
    this.setState({ data: recipes, favorites: status });
  };

  filterFavorites = recipes => {
    return recipes.filter(recipe => recipe.isFavorite);
  };

  updateRecipeFavorite = (recipe, status) => {
    let temp = this.state.masterData;
    temp.filter(some => some.title === recipe.title)[0].isFavorite = status;
    this.setState({ masterData: temp });
    if (this.state.favorites) {
      this.displayFavorites(this.filterFavorites(this.state.masterData), true);
    }
  };

  handleFABPress = () => {
    document.body.classList.add("noscroll");
    this.setState({ renderModal: true });
  };

  handleFormClose = () => {
    document.body.classList.remove("noscroll");
    this.setState({ renderModal: false });
  };

  handleNewRecipe = newRecipe => {
    let newData = this.state.masterData.concat(newRecipe);
    this.setState({ masterData: newData, data: newData });
  };

  render() {
    let body;
    if (this.state.loading) {
      return (
        <div className="text-center">
          <FontAwesome name="spinner" size="3x" spin />
        </div>
      );
    }

    if (!this.state.user) {
      body = 
      <FrontPage 
        errorMessage={this.state.errorMessage}
        handleSignIn={this.handleSignIn}
        handleSignUp={this.handleSignUp}
      />
    } else {
      let recipes = this.state.data;
      let recipeDict = {};
      if (recipes.length > 0) {
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
      body = 
        <div>
          <Header
            masterData={this.state.masterData}
            parentCallback={this.displayFavorites}
            favorite={this.state.favorites}
            user={this.state.user}
            handleSignOut={this.handleSignOut}
          />
          <main>
            <div className="search-page">
              <Logo img={require('./img/logo.png')} />
              <div className="recipe-container">
                <SearchBar
                  masterData={this.state.masterData}
                  parentCallback={this.performSearch}
                />
                {this.state.data.length === 0 ?
                  <div className="no-results">No search results</div>
                  :
                  <div className="list-container">
                  {sortedKeys.map(letter => {
                    const recipes = recipeDict[letter].sort();
                    return (
                      <LetterContainer
                        key={letter}
                        letter={letter}
                        recipes={recipes}
                        parentCallback={this.updateRecipeFavorite}
                        masterData={this.state.masterData}
                      />
                    );
                  })}
                </div>
                }
                {this.state.renderModal ? (
                  <FormModal
                    handleFormClose={this.handleFormClose}
                    handleNewRecipe={this.handleNewRecipe}
                    user={this.state.user} />
                ) : null}
                <FAB handleFABPress={this.handleFABPress} />
              </div>
            </div>
          </main>
          <Footer />
        </div>
    }
    return ( 
      body
    );
  }
}

class LetterContainer extends Component {
  render() {
    return (
      <div id={this.props.letter} className="letter-container">
        <p className="alphabet-letter">{this.props.letter}.</p>
        {this.props.recipes.map(recipe => {
          return (
            <Recipe
              key={recipe.title}
              recipe={recipe}
              parentCallback={this.props.parentCallback}
              isFavorite={this.props.masterData.filter(x => recipe.title === x.title)[0].isFavorite}
            />
          );
        })}
      </div>
    );
  }
}

class Recipe extends Component {
  constructor(props) {
    super(props);
    this.state = { displayDetails: false };
  }

  // TODO: When you fix this, at the end make sure to update the DB.
  /*
  toggleFavorite = () => {
    this.setState(currentState => {
      return { isFavorite: !currentState.isFavorite };
    });
    this.props.parentCallback(
      this.props.recipe,
      !this.state.isFavorite,
    );
  };*/

  handleClick = () => {
    this.setState(currentState => {
      return { displayDetails: !currentState.displayDetails };
    });
  };

  render() {
    const recipe = this.props.recipe;
    return (
      <div className="recipe-group">
        <div
          className="recipe-letter-container"
          role="button"
          onClick={() => {
            this.handleClick();
          }}
        >
          <div className="recipe">
            <img
              className="foodimage"
              alt={`${
                recipe.imageName ? recipe.imageName : "recipe saver logo"
              }`}
              src={
                recipe.imageName && recipe.imageName.startsWith("data")
                  ? recipe.imageName
                  : require(`${
                      recipe.imageName
                        ? "./recipeImages/" + recipe.imageName
                        : "./recipeImages/default.jpg"
                    }`)
              }
            />
            <div className="recipe-info">
              <div className="title-container">
                <p className="recipe-title">{recipe.title}</p>
                <img
                  className="favoriteIcon"
                  alt="favorite star icon"
                  role="button"
                  src={
                    this.props.isFavorite
                      ? require("./img/star-true.png")
                      : require("./img/star-false.png")
                  }
                  onClick={event => {
                    event.stopPropagation();
                    this.props.parentCallback(recipe, !this.props.isFavorite); //updateMasterDataFavorite
                  }}
                />
              </div>
              <p className="recipe-description">
                {recipe.description || "Add a description!"}
              </p>
              <p>Category: {recipe.category || "none"}</p>
              <p>
                Subcategory: {recipe.subcategory || "none"}
              </p>
            </div>
          </div>
        </div>
        <RecipeDetails
          recipe={recipe}
          displayDetails={this.state.displayDetails}
        />
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
                return <li key={ingredient}>{ingredient}</li>;
              })}
            </ul>
          </div>
          <div className="directions-container">
            <h2>Directions:</h2>

            {recipe.estimatedTime ? (
              <div className="time">
                <FontAwesome name="clock-o" />
                {" " + this.toTimeString(recipe.estimatedTime)}
              </div>
            ) : null}

            <div className="directions">
              <ol>
                {procedure.map(step => {
                  return <li key={step}>{step}</li>;
                })}
              </ol>
            </div>
          </div>
        </div>
      );
    } else {
      return null;
    }
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
          <FontAwesome name="search-plus" />
        </button>
      </form>
    );
  }
}


export default App;
