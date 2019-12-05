import React, { Component } from "react";
import "whatwg-fetch";
import firebase from "firebase/app";
import FontAwesome from 'react-fontawesome';
import { Redirect, Switch, Route } from 'react-router-dom';

import Logo from './components/Logo';
import FrontPage from './components/FrontPage';
import Header from './components/Header';
import FormModal from './components/FormModal';
import FAB from './components/FAB';
import Footer from './components/Footer';

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
      loading: true,
      about: false
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
              obj.id = key;
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

  // Firebase Auth: Remove listener when component is unmounted
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
    this.setState({ data: recipes, favorites: status, about: false });
  };

  filterFavorites = recipes => {
    return recipes.filter(recipe => recipe.isFavorite);
  };

  // When a recipe is favorited, change the value in the database.
  updateRecipeFavorite = (recipe, status) => {
    let recipeRef = firebase.database().ref(this.state.user.uid + '/' + recipe.id + '/isFavorite');
    recipeRef.set(!recipe.isFavorite);

    this.state.masterData.filter(some => some.title === recipe.title)[0].isFavorite = status;
    if (this.state.favorites) {
      this.displayFavorites(this.filterFavorites(this.state.masterData), true);
    }
  };

  // Open modal
  handleFABPress = () => {
    document.body.classList.add("noscroll");
    this.setState({ renderModal: true });
  };

  // Close modal
  handleFormClose = () => {
    document.body.classList.remove("noscroll");
    this.setState({ renderModal: false });
  };

  handleAbout = () => {
    this.setState(currentState => {
      let stateChanges = {about: !currentState.about, favorites: false}
      return stateChanges
    })
  }

  renderMainPage = () => {
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
      return <div>
        <Header
          masterData={this.state.masterData}
          parentCallback={this.displayFavorites}
          favorite={this.state.favorites}
          about={this.state.about}
          user={this.state.user}
          handleSignOut={this.handleSignOut}
          handleAbout={this.handleAbout}
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

  render() {
    if (this.state.loading) {
      return (
        <div className="text-center">
          <FontAwesome name="spinner" size="3x" spin />
        </div>
      );
    }

    return ( 
      <Switch>
        <Route exact path='/' >
          {this.state.user ? 
          <Redirect to='/home' /> :
          <FrontPage 
            errorMessage={this.state.errorMessage}
            handleSignIn={this.handleSignIn}
            handleSignUp={this.handleSignUp}
          /> }
        </Route>
        <Route exact path='/home' >
          {this.state.user ? 
          this.renderMainPage() :
          <Redirect to='/' /> }
        </Route>
        <Redirect to='/' />
      </Switch>
    );
  }
}

class LetterContainer extends Component {
  render() {
    const recipes = this.props.recipes.map(recipe => {
      return (
        <Recipe
          key={recipe.title}
          recipe={recipe}
          parentCallback={this.props.parentCallback}
          isFavorite={this.props.masterData.filter(x => recipe.title === x.title)[0].isFavorite}
        />
      );
    })
    return (
      <div id={this.props.letter} className="letter-container">
        <p className="alphabet-letter">{this.props.letter}.</p>
        {recipes}
      </div>
    );
  }
}

class Recipe extends Component {
  constructor(props) {
    super(props);
    this.state = { displayDetails: false };
  }

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

  handleChange = (event) => {
    let newVal = event.target.value;
    if (newVal === "") {
      this.setState({ value: newVal });
      this.props.parentCallback(this.props.masterData);
    } else {
      this.setState({ value: newVal });
    }
  };

  handleSubmit = (event) => {
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
