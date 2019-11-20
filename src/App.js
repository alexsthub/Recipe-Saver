import React, { Component } from "react";
import "whatwg-fetch";
import { Button } from 'reactstrap';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { masterData: [], data: [], renderModal: false, favorites: false };
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

  displayFavorites = (recipes, status) => {
    console.log(status)
    this.setState({ data: recipes, favorites: status });
  }

  updateRecipeFavorite = (recipe, status) => {
    let temp = this.state.masterData;
    temp.filter(some => some.title === recipe.title)[0].isFavorite = status
    this.setState({ masterData: temp })
  }

  handleFABPress = () => {
    document.body.classList.add('noscroll');
    this.setState({ renderModal: true });
  };

  handleFormClose = () => {
    document.body.classList.remove('noscroll');
    this.setState({ renderModal: false });
  };

  handleNewRecipe = (newRecipe) => {
    let newData = this.state.masterData.concat(newRecipe);
    this.setState({masterData: newData, data: newData})
  }

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
    return (
      <div>
        <Header 
          masterData={this.state.masterData}
          parentCallback={this.displayFavorites}
          favorite={this.state.favorites}
        />
        <main>
          <div className="search-page">
            <Logo />
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
                    />
                  );
                })} 
              </div>
              }
              {this.state.renderModal ? (
                <FormModal 
                  handleFormClose={this.handleFormClose}
                  handleNewRecipe={this.handleNewRecipe} />
              ) : null}
              <FAB handleFABPress={this.handleFABPress} />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
}

class FormModal extends Component {
  constructor(props) {
    super(props);
    this.state = { title: '', image: null, ingredientList: [], procedureList: [], 
    description: '', category: '', subcategory: '', estimatedTime: '', isFavorite: false };
  }

  handleFavoritePress = () => {
    this.setState({ isFavorite: !this.state.isFavorite });
  };

  handleListSubmit = (newData, type) => {
    if (type === 'ingredient') {
      this.setState({ingredientList: newData})
    } else {
      this.setState({procedureList: newData})
    }
  }

  handleDeleteRow = (option, type) => {
    if (type === 'ingredient') {
      this.setState({ingredientList: this.state.ingredientList.filter(el => el !== option)})
    } else {
      this.setState({procedureList: this.state.procedureList.filter(el => el !== option)})
    }
  }

  // TODO: stop the background from scrolling.
  handleFormSubmit = (event) => {
    event.preventDefault();

    if (this.state.title === '') {return;}

    let objectUrl;
    if (this.state.image) {
      const blob = new Blob([this.state.image]);
      objectUrl = window.URL.createObjectURL(blob);
    }

    const newRecipe = {
      category: this.state.category !== '' ? this.state.category: null,
      description: this.state.description !== '' ? this.state.description: null,
      estimatedTime: this.state.estimatedTime!== '' ? parseInt(this.state.estimatedTime): null,
      imageName: this.state.image && objectUrl ? objectUrl : null,
      ingredients: this.state.ingredientList.join('|'),
      procedure: this.state.procedureList.join('|'),
      subcategory: this.state.subcategory !== '' ? this.state.subcategory: null,
      title: this.state.title !== '' ? this.state.title: null,
      times: null,
      isFavorite: this.state.isFavorite
    }
    this.props.handleNewRecipe(newRecipe);
    this.props.handleFormClose();
  }

  render() {
    return (
      <div className="form-overlay">
        <form onSubmit={this.handleFormSubmit} id="recipe-submit" action="" encType="multipart/form-data">
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

              <InputContainer
                title={"Recipe Name"}
                id={"title"}
                value={this.state.title}
                onChange={(event) => this.setState({title: event.target.value})}
                placeholder={"Recipe Title..."}
                aria-label={"Enter Recipe Name"}
                type={"text"}
                multiLine={false}
                required={true}
              />

              <ImageInputContainer
                title={'Upload an Image (Optional)'}
                file={this.state.image}
                onChange={(image) => this.setState({image: image})}/>

              <ListInputContainer
                title={"Ingredients"}
                type={"ingredient"}
                data={this.state.ingredientList}
                handleSubmit={this.handleListSubmit}
                handleDeleteRow={this.handleDeleteRow}
                id={"procedure-input"}
                placeholder={"Enter a step..."}
                aria-label={"Enter Steps"}
                required={true}
              />

              <ListInputContainer
                title={"Procedure"}
                type={"procedure"}
                data={this.state.procedureList}
                handleSubmit={this.handleListSubmit}
                handleDeleteRow={this.handleDeleteRow}
                id={"ingredient-input"}
                placeholder={"Enter an Ingredient..."}
                aria-label={"Enter Recipe Ingredient"}
                required={true}
              />

              <InputContainer
                title={"Recipe Description"}
                id={"description"}
                value={this.state.description}
                onChange={(event) => this.setState({description: event.target.value})}
                placeholder={"Recipe Description..."}
                aria-label={"Enter Recipe Description"}
                multiLine={true}
                rows={5}
              />

              <InputContainer
                title={"Category"}
                id={"category"}
                value={this.state.category}
                onChange={(event) => this.setState({category: event.target.value})}
                placeholder={"Recipe Category..."}
                aria-label={"Enter Recipe Category"}
                type={'text'}
              />

              <InputContainer
                title={"Subcategory"}
                id={"subcategory"}
                value={this.state.subcategory}
                onChange={(event) => this.setState({subcategory: event.target.value})}
                placeholder={"Recipe Subcategory..."}
                aria-label={"Enter Recipe Subcategory"}
                type={'text'}
              />

              <InputContainer
                title={"Estimated Time in Minutes"}
                id={"time"}
                value={this.state.estimatedTime}
                onChange={(event) => this.setState({estimatedTime: event.target.value})}
                placeholder={"Recipe Estimated Time..."}
                aria-label={"Enter Recipe Estimated Time"}
                type={'number'}
              />

              <div className="submit-container">
                <Button onClick={this.handleFormSubmit} color='primary'>Submit</Button>
              </div>

            </div>
          </div>
        </form>
      </div>
    );
  }
}

class ImageInputContainer extends Component {
  constructor(props) {
    super(props);
    this.state={file: null, hasError: false, dragOn: false}
  }

  endsWithAny(string, endings) {
    return endings.some(function (ending) {
      return string.endsWith(ending);
    })
  }

  handleFileChange = (event) => {
    let file = event.target.files[0];
    this.processFile(file);
  }

  processFile = (file) => {
    if (this.endsWithAny(file.name, ['jpg', 'png', 'tif', 'svg'])) {
      this.setState({hasError: false});
      this.props.onChange(file);
    } else {
      this.setState({hasError: true});
    }
  }

  handleDragStart = (event) => {
    event.preventDefault();
    event.stopPropagation();
    this.setState({dragOn: true})
  }

  handleDragEnd = (event) => {
    this.setState({dragOn: false})
  }

  handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    this.handleDragEnd();
    let file = event.dataTransfer.files[0];
    this.processFile(file);
  }

  render() {
    return (
      <div className="input-container">
        <p>Upload an Image (Optional)</p>
        <div className="line"></div>
        <div className={!this.state.dragOn ? "box" : "box is-dragover"} draggable 
          onDragOver={this.handleDragStart} onDragEnter={this.handleDragStart} 
          onDragLeave={this.handleDragEnd} onDragEnd={this.handleDragEnd} onDrop={this.handleDrop}>
          <div className="box-input">
            <input onChange={this.handleFileChange} type="file" name="file" id="file" className="input-file" />
            <label htmlFor="file">
              <div className="input-clickable">
                <img className="box-image" alt='upload' src={require("./img/upload.png")} />
                <span>
                  {this.state.hasError ? 
                  <p className='error-message'>Invalid File Type. Try again with an image.</p> : 
                  this.props.file ? <p>{this.props.file.name}</p> : <p><strong>Choose a file </strong>or drag it here.</p>}
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
    this.state = {value: ''}
  }

  renderListItems = () => {
    return (
      this.props.data.map((option, i) => {
        return <li key={i} className='list-item'>
          <div className='list-item-contents'>
            <p>{option}<img onClick={() => this.props.handleDeleteRow(option, this.props.type)} alt='delete item' src={require("./img/minus.png")}/></p>
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
    const newData = this.props.data.concat(this.state.value);
    this.setState({value: ''});
    this.props.handleSubmit(newData, this.props.type);
  }

  handleChange = (event) => {
    this.setState({value: event.target.value});
  }

  keyPressed = (event) => {
    if (event.key === "Enter") {
      this.submitInput()
      event.preventDefault();
    }
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
            onKeyPress={this.keyPressed}
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
            value={this.props.value}
            onChange={this.props.onChange}
            className="recipe-description"
            placeholder={this.props.placeholder}
            rows={this.props.rows}
          />
        ) : (
          <input
            id={this.props.id}
            className="standard-input"
            value={this.props.value}
            onChange={this.props.onChange}
            placeholder={this.props.placeholder}
            aria-label={this.props.ariaLabel}
            type={this.props.type}
            required={this.props.required}
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
          return <Recipe key={recipe.title} recipe={recipe} parentCallback={this.props.parentCallback} />;
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
    this.props.parentCallback(this.props.recipe, !this.state.isFavorite);
  };

  handleClick = () => {
    this.setState(currentState => {
      console.log(!currentState.displayDetails)
      return {displayDetails: !currentState.displayDetails}
    })
  }

  render() {
    const recipe = this.props.recipe;
    return (
      <div className="recipe-group">
        <div className="recipe-letter-container" onClick={() => {this.handleClick()}}>
          <div className="recipe">
            <img
              className="foodimage"
              alt={`${
                recipe.imageName ? recipe.imageName : "recipe saver logo"
              }`}
              src={recipe.imageName && recipe.imageName.startsWith("blob") ? recipe.imageName : require(`${
                  recipe.imageName ?  "./recipeImages/" + recipe.imageName :
                  "./recipeImages/default.jpg"}`)}
              />
            <div className="recipe-info">
              <div className="title-container">
                <p className="recipe-title">{recipe.title}</p>
                <img
                  className="favoriteIcon"
                  alt="favorite star icon"
                  src={
                    this.state.isFavorite
                      ? require("./img/star-true.png")
                      : require("./img/star-false.png")
                  }
                  onClick={
                    event => {
                      event.stopPropagation()
                      this.toggleFavorite()
                    }
                  }
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
        <RecipeDetails recipe={recipe} displayDetails={this.state.displayDetails} />
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
                <i className="fa fa-clock-o" aria-hidden="true"></i> 
                {' ' + this.toTimeString(recipe.estimatedTime)}
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

class Header extends Component {

  filterFavorites = () => {
    return this.props.masterData.filter(recipe => recipe.isFavorite)
  }

  render() {
    return (
      <header>
        <div className="topbar">
          <h1 className="title">
            <i className="fa fa-shopping-basket" aria-hidden="true"></i>
          </h1>
          <div className="nav">
            <p className={'all' + this.props.favorite ? '' : ' selected'}  onClick={() => {
              this.props.parentCallback(this.props.masterData, false)
            }
            }>All</p>
            <p className={'favorite' + this.props.favorite ? ' selected' : ''} onClick={() => {
              this.props.parentCallback(this.filterFavorites(), true)
            }
            }>Favorites</p>
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
