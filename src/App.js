import React, { Component } from "react";
import "whatwg-fetch";

const stuff = [
  {
    category: "dinner",
    description: "Discover Fluffy Tapioca Cream, infused with egg yolk and flavored with vanilla. Serve Fluffy Tapioca Cream either warm or cold for a luscious dessert.",
    estimatedTime: null,
    imageName: "Fluffy Tapioca Cream.jpg",
    ingredients: "3 Tbsp. MINUTE Tapioca|2 cups milk|1 egg, separated|6 Tbsp. sugar, divided|1 tsp. vanilla",
    procedure: "Combine tapioca, milk, egg yolk and 3 Tbsp. sugar in medium saucepan. Let stand 5 min.|Meanwhile, beat egg white in small bowl with mixer on high speed until foamy. Gradually add remaining sugar, beating constantly until soft peaks form.|Bring to full boil on medium heat, stirring constantly. Remove from heat. Quickly stir egg white mixture into hot tapioca in saucepan until well blended. Stir in vanilla. Cool 20 min. Stir before serving.",
    subcategory: "Desserts Recipes",
    title: "Fluffy Tapioca Cream",
    times: "06/21/2018, 18:24:31",
    isFavorite: false
 },
 {
    category: "dinner",
    description: "Our Fudgy Walnut Pie is super chocolatey and requires a full cup and a half of walnuts. It is, quite simply, the best you'll ever have.",
    estimatedTime: 105,
    imageName: "Fudgy Walnut Pie.jpg",
    ingredients: "1/2 pkg. (15 oz.) ready-to-use refrigerated pie crusts (1 crust)|2 pkg. (4 oz. each) BAKERS Semi-Sweet Chocolate, broken into pieces|1/4 cup (1/2 stick) butter, softened|3/4 cup firmly packed brown sugar|3 eggs|1 tsp. vanilla|1/4 cup flour|1 cup chopped PLANTERS Walnuts|1/2 cup PLANTERS Walnut Halves",
    procedure: "Position oven rack in lower third of oven. Preheat oven to 375°F. Prepare pie crust as directed on package, using 9-inch pie plate; set aside. Microwave chocolate in large microwaveable bowl on HIGH 2 min. Stir until chocolate is completely melted; set aside.|Beat butter and sugar in large bowl with electric mixer on medium speed until light and fluffy. Add eggs, 1 at a time, beating well after each addition. Blend in melted chocolate and vanilla. Add flour; mix well. Stir in chopped walnuts. Pour into crust. Arrange walnut halves over filling.|Bake 25 min. or until center of filling is set. Cool completely. Refrigerate at least 1 hour before serving.",
    subcategory: "Desserts Recipes",
    title: "Fudgy Walnut Pie",
    times: "01/06/2018, 18:46:08|09/15/2018, 04:10:00",
    isFavorite: false
 },
 {
    category: "dinner",
    description: "As if banana pudding weren't luscious enough on its own, we've gilded the dessert lily and layered it with vanilla wafers and a sweet pecan topping.",
    estimatedTime: 225,
    imageName: "Deep-Dish Layered Banana Pudding.jpg",
    ingredients: "46 vanilla wafers, divided|1/2 cup chopped PLANTERS Pecans|1/3 cup packed brown sugar|1 tsp. ground cinnamon|3 Tbsp. butter, melted|2 pkg. (3.4 oz. each) JELL-O Vanilla Flavor Instant Pudding|2 cups cold milk|1 tub (8 oz.) COOL WHIP Whipped Topping, thawed, divided|4 banana s (1 lb.), sliced|1 pkg. (8 oz.) PHILADELPHIA Cream Cheese, softened|1/4 cup granulated sugar",
    procedure: "Heat oven to 350ºF.|Crush 30 wafers; mix with next 4 ingredients. Spread onto bottom of rimmed baking sheet sprayed with cooking spray. Bake 8 to 10 min. or until golden brown, stirring after 5 min. Cool.|Beat pudding mixes and milk in medium bowl with whisk 2 min. (Pudding will be thick.) Stir in 1 cup COOL WHIP.|Layer 1/3 of the crumb mixture and half each of the bananas and pudding in 2-qt. bowl; repeat layers.|Beat cream cheese and granulated sugar in medium bowl with mixer until blended. Gently stir in 1 cup of the remaining COOL WHIP; spread over top of dessert, sealing to edge of bowl. Sprinkle with remaining crumb mixture. Refrigerate 3 hours.|Serve topped with remaining COOL WHIP and whole wafers.",
    subcategory: "Desserts Recipes",
    title: "Deep-Dish Layered Banana Pudding",
    times: "02/25/2018, 03:22:00",
    isFavorite: false
 },
 {
    category: "dinner",
    description: "Make your day more colorful with our Berry Fruit Tart recipe. Fresh blackberries, raspberries and sliced strawberries combine delightfully with cream cheese and puff pastry in our Berry Fruit Tart.",
    estimatedTime: 75,
    imageName: "Berry Fruit Tart.jpg",
    ingredients: "1 frozen puff pastry sheet (1/2 of 17-1/4-oz. pkg.), thawed|1 pkg. (8 oz.) PHILADELPHIA Cream Cheese, softened|1/3 cup powdered sugar|2 Tbsp. apple juice|3 cups mixed assorted berries (blackberries, raspberries and sliced strawberries)|2 Tbsp. apple jelly, melted, cooled",
    procedure: "Heat oven to 400°F.|Unfold pastry on lightly floured surface; roll into 14x10-inch rectangle with rolling pin. Transfer to large baking sheet; brush edges with water. Fold over 1/2 inch around all sides, then press firmly onto bottom of pastry to form rim. Pierce bottom of pastry in several places with fork.|Bake 15 min. or until golden brown, breaking any large air bubbles with fork after 10 min. Transfer pastry to wire rack; cool completely.|Beat cream cheese, sugar and apple juice until blended; spread onto pastry. Top with berries. Brush melted jelly over fruit just before serving.",
    subcategory: "Desserts Recipes",
    title: "Berry Fruit Tart",
    times: "07/13/2019, 07:30:22",
    isFavorite: false
 },
 {
    category: "dinner",
    description: "Start spreading the news for Pineapple-Topped New York Cheesecake. This Pineapple-Topped New York Cheesecake is great for a special occasion.",
    estimatedTime: 380,
    imageName: "Pineapple-Topped New York Cheesecake.jpg",
    ingredients: "7 graham crackers, finely crushed (about 1 cup)|3 Tbsp. butter, melted|1 cup plus 3 Tbsp. sugar, divided|4 pkg. (8 oz. each) PHILADELPHIA Cream Cheese, softened|1 cup BREAKSTONES or KNUDSEN Sour Cream|1 Tbsp. vanilla|4 egg s|1 can (8 oz.) pineapple tidbits in juice, very well drained|1/2 cup pineapple preserves",
    procedure: "Heat oven to 325ºF.|Mix graham crumbs, butter and 3 Tbsp. sugar; press onto bottom of 9-inch springform pan. Bake 10 min.|Meanwhile, beat cream cheese and remaining sugar with mixer until well blended. Beat in sour cream and vanilla. Add eggs, 1 at a time, beating on low speed after each just until blended.|Pour batter over crust. Bake 55 min. to 1 hour or until center is almost set. Run knife around rim of pan to loosen cake; cool before removing rim. Refrigerate cheesecake 4 hours.|Mix pineapple and preserves; spread over cheesecake just before serving.",
    subcategory: "Desserts Recipes",
    title: "Pineapple-Topped New York Cheesecake",
    times: "08/23/2018, 16:15:39",
    isFavorite: false
 }];

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { data: null };
  }

  componentDidMount() {
    // fetch('./jsonData_small.json')
    // .then((response) => {
    //   console.log(response);
    //   return response.json();
    // })
    // .catch((error) => {
    //   console.log(error.message);
    // })
    // .then((data) => {
    //   console.log(data);
    //   this.setState({data: data.response});
    // })
    this.setState({data: stuff});
  }

  render() {
    // let recipes = this.state.data;
    // recipes.sort((a, b) => {
    //   const textA = a.title.toUpperCase();
    //   const textB = b.title.toUpperCase();
    //   return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
    // });

    // TODO: For each recipe, we need to create a recipe container.
    // In that container, it will have the recipe and the recipe details. Only show recipe details on click

    return (
      <div>
        <Header />
        <main>
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
        </main>
        <Footer />
      </div>
    );
  }
}

class Recipe extends Component {
  constructor(props) {
    super(props);
    this.state = {displayDetails: false, isFavorite: props.recipe.isFavorite}
  }

  render() {
    const recipe = this.props.recipe;
    return (
      <div className="recipe-group">
        <div className="recipe-letter-container" onPress={() => this.setState({displayDetails: !this.state.displayDetails})}>
          <div className="recipe">
            <img
              className="foodimage"
              alt={`${
                recipe.imageName ? recipe.imageName : "recipe saver logo"
              }`}
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
                  src={`img/${
                    recipe.isFavorite ? "star-true" : "star-false"
                  }.png`}
                />
              </div>
              <p className="recipe-description">
                {recipe.description ? recipe.description : "Add a description!"}
              </p>
              <p>Category: ${recipe.category ? recipe.category : "none"}</p>
              <p>
                Subcategory: ${recipe.subcategory ? recipe.subcategory : "none"}
              </p>
            </div>
          </div>
        </div>
        <RecipeDetails recipe={this.recipe} displayDetails={this.state.displayDetails}/>
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
    } else {return;} 
  }
}

class LetterContainer extends Component {
  render() {
    const letter = this.props.letter;
    let recipes = this.props.recipes.map(r => {
      return <Recipe recipe={r} />;
    });

    return (
      <div id={letter} className="letter-container">
        <p class="alphabet-letter">{letter}.</p>
        {/* Render recipe groups */}
      </div>
    );
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
