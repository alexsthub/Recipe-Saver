'use strict';
// Fetch data
let recipes;
fetch('./jsonData_small.json')
  .then((response) => {
    return response.json();
  })
  .catch((error) => {
    console.log(error.message);
  })
  .then((data) => {
    recipes = data.response;
    renderRecipes(recipes);
  })

function renderRecipes(recipes) {
  // Sort by title
  recipes.sort((a, b) => {
    const textA = a.title.toUpperCase();
    const textB = b.title.toUpperCase();
    return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
  });
  // Delete all children
  let recipeContainer = $('div.list-container');
  recipeContainer.empty();

  recipes.forEach((recipe) => {
    const firstLetter = recipe.title.charAt(0).toUpperCase();
    let letterContainer = $(`div#${firstLetter}.letter-container`);
    if (letterContainer.length > 0) {
      // Append recipe to the list
      addRecipeToList(letterContainer, recipe);
    } else {
      // Create new container and add recipe to container
      createContainerWithRecipe(recipe, firstLetter);
    }
  })
}

function createContainerWithRecipe(recipe, letter) {
  let newContainer = $(`
    <div id="${letter}" class="letter-container">
      <p class="alphabet-letter">${letter}.</p>      
    </div>`)
  addRecipeToList(newContainer, recipe)
  // find the correct parent that is right above 
  addToCorrectParent(letter, newContainer)
}

function addToCorrectParent(letter, newContainer) {
  let allLetterContainers = $('div.letter-container');
  if (allLetterContainers.length === 0) {
    newContainer.appendTo($('div.list-container'));
  } else if (allLetterContainers.length === 1) {
    let container = allLetterContainers[0];
    if (letter < container.id) {
      newContainer.insertBefore(container);
    } else {
      newContainer.insertAfter(container);
    }
  } else {
    for (var i = 0; i < allLetterContainers.length; i++) {
      let current = allLetterContainers[i]
      let next = allLetterContainers[i + 1]
      if (letter < current.id) {
        newContainer.insertBefore(current);
      } else if (!next && letter > current.id) {
        newContainer.insertAfter(current);
      } else if (letter > current.id && letter < next.id) {
        newContainer.insertAfter(current)
      }
    }
  }
}

// build recipe details
function addRecipeDetails(parent, recipe) {
  let ingredients = recipe.ingredients.split("|");
  let procedure = recipe.procedure.split("|");
  let recipeDetails = $(`
    <div class="recipe-details">
      <div class="ingredients">
        <h2>Ingredients:</h2>
          <ul>
            ${ingredients.reduce((acc, curr) => acc + "<li>" + curr + "</li>", "")}
          </ul>
      </div>
      <div class="directions-container">
        <h2>Directions:</h2>
        <div class="time">
          <i class="fa fa-clock-o" aria-hidden="true"></i> ${recipe.estimatedTime} min
        </div>
        <div class="directions">
          <ol>
            ${procedure.reduce((acc, curr) => acc + "<li>" + curr + "</li>", "")}
          </ol>
        </div>
      </div>
    </div>`)
  recipeDetails.appendTo(parent);
}

function addRecipeToList(parent, recipe) {
  let newRecipe = $(`
  <div class="recipe-group">
    <div class="recipe-letter-container">
      <div class="recipe">
        <img class="foodimage" alt="${recipe.imageName ? recipe.imageName : 'recipe saver logo'}" src="${recipe.imageName ? 
        recipe.imageName.startsWith('blob') ? recipe.imageName : "./recipeImages/" + recipe.imageName : "./recipeImages/default.jpg"}">
        <div class="recipe-info">
          <div class="title-container">
            <p class="recipe-title">${recipe.title}</p>
            <img class="favoriteIcon" alt="favorite star icon" src="img/${recipe.isFavorite ? 'star-true' : 'star-false'}.png" />
          </div>
          <p class="recipe-description">${recipe.description ? recipe.description : 'Add a description!'}</p>
          <p>Category: ${recipe.category ? recipe.category : 'none'}</p>
          <p>Subcategory: ${recipe.subcategory ? recipe.subcategory : 'none'}</p>
        </div>
      </div>
    </div>
  </div>`);

  // toggle favorite
  let favoriteIcon = newRecipe.find('img.favoriteIcon');
  favoriteIcon.click(event => {
    event.stopPropagation();
    if (recipe.isFavorite) {
      favoriteIcon.attr("src", "img/star-false.png");
      recipe.isFavorite = false;
    } else {
      favoriteIcon.attr("src", "img/star-true.png");
      recipe.isFavorite = true;
    }
  });

  // toggle recipe details
  newRecipe.find('div.recipe-letter-container').click(() => {
    if (newRecipe.children(".recipe-details").length > 0) {
      newRecipe.children(".recipe-details").remove();
    } else {
      addRecipeDetails(newRecipe, recipe);
    }
  });
  newRecipe.appendTo(parent);
}

$('div.fab').click(() => {
  renderModal()
})

function renderModal() {
  let form = $(`
    <div class="form-overlay">
      <form id="recipe-submit" action="" enctype="multipart/form-data">
        <div class="form-container">
          <div class="form-elements-container">
            <span class="close">&times;</span>
            <h1>Enter A New Recipe!</h1>
            <div class="input-container horizontal center">
              <img class="favoriteIcon" alt="favorite star icon" src="img/star-false.png" />
              <p id="favorite-text">Click the Star To Mark As a Favorite!</p>
            </div>

            <div class="input-container">
              <p>Recipe Name *</p>
              <div class="line"></div>
              <input id="title" class="standard-input" placeholder="Recipe Title..." aria-label="Enter Recipe Name" type="text" required>
            </div>

            <div class="input-container">
              <p>Upload an Image (Optional)</p>
              <div class="line"></div>
              <div class="box">
                <div class="box-input">
                  <input type="file" name="file" id="file" class="input-file" />
                  <label for="file">
                    <div class="input-clickable">
                      <img class="box-image" src="./img/upload.png" />
                      <span><strong>Choose a file </strong>or drag it here.</span>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            <div class="input-container">
              <p>Ingredients *</p>
              <div class="line"></div>
              <ul id="ingredient-list"></ul>
              <div class="list-input">
                <img src="./img/shoppingCart.png" />
                <input id="ingredient-input" placeholder="Enter an Ingredient..."
                  aria-label="Enter Recipe Ingredient" type="text">
                <p id="ingredient-add">Add</p>
              </div>
            </div>

            <div class="input-container">
              <p>Procedure *</p>
              <div class="line"></div>
              <ol id="procedure-list"></ol>
              <div class="list-input">
                <img src="./img/paperclip.png" />
                <input id="procedure-input" placeholder="Enter a Step..." aria-label="Enter Steps" type="text">
                <p id="procedure-add">Add</p>
              </div>
            </div>

            <div class="input-container">
              <p>Recipe Description (Optional)</p>
              <div class="line"></div>
              <textarea id="description" placeholder="Recipe Description..." rows="5" class="recipe-description"></textarea>
            </div>

            <div class="input-container">
              <p>Category (Optional)</p>
              <div class="line"></div>
              <input id="category" class="standard-input" placeholder="Recipe Category..." aria-label="Enter Recipe Category" type="text">
            </div>

            <div class="input-container">
              <p>Subcategory (Optional)</p>
              <div class="line"></div>
              <input id="subcategory" class="standard-input" placeholder="Recipe Subcategory..." aria-label="Enter Recipe Subcategory" type="text">
            </div>

            <div class="input-container">
              <p>Estimated Time (Optional)</p>
              <div class="line"></div>
              <input id="time" class="standard-input" placeholder="Recipe Estimated Time..." aria-label="Enter Recipe Estimated Time" type="text">
            </div>

            <div class="submit-container">
              <button type="submit" class="btn btn-primary">Submit</button>
            </div>

          </div>
        </div>
      </form>
    </div>`);

  $('body').addClass('noscroll');

  // Visually handle file input. Modified code from source.
  /*
  	By Osvaldas Valutis, www.osvaldas.info
  	Available for use under the MIT License
  */

  let droppedFile;
  (function ($) {
    form.find('.input-file').each(function () {
      const $input = $(this),
        $label = $input.next('label'),
        labelVal = $label.html();

      $input.on('change', function () {
        if (this.files.length > 0) {
          let fileName = '';
          droppedFile = this.files[0];
          fileName = droppedFile.name;

          const span = $label.find('span');
          if (endsWithAny(fileName, ['jpg', 'png', 'tif', 'svg'])) {
            span.html(fileName);
            span.removeClass('error-message');
          } else {
            span.html('Invalid File Type. Try again with an image.')
            span.addClass('error-message');
            droppedFile = null;
          }
        }
      });
    });
  })(jQuery, window, document);

  // Handle drag input
  let fileInput = form.find('div.box');
  fileInput.on('drag dragstart dragend dragover dragenter dragleave drop', function (e) {
      e.preventDefault();
      e.stopPropagation();
    })
    .on('dragover dragenter', function () {
      fileInput.addClass('is-dragover');
    })
    .on('dragleave dragend drop', function () {
      fileInput.removeClass('is-dragover');
    })
    .on('drop', function (e) {
      droppedFile = e.originalEvent.dataTransfer.files[0];
      const fileName = droppedFile.name;
      let span = form.find('.input-clickable span');
      if (endsWithAny(fileName, ['jpg', 'png', 'tif', 'svg'])) {
        span.html(fileName);
        span.removeClass('error-message');
      } else {
        span.html('Invalid File Type. Try again with an image.')
        span.addClass('error-message');
        droppedFile = null;
      }
    });

  // Handle star on click
  let isFavorite = false;
  let star = form.find('img.favoriteIcon');
  star.click(() => {
    if (isFavorite) {
      isFavorite = false;
      star.attr("src", "img/star-false.png")
    } else {
      isFavorite = true;
      star.attr("src", "img/star-true.png")
    }
  })

  // On exit handler
  form.find('span.close').click(() => {
    $('body').removeClass('noscroll');
    form.remove();
  })

  // Add items to ingredients list
  let ingredientList = form.find('#ingredient-list');
  let ingredientInput = form.find('#ingredient-input');
  let ingredientAdd = form.find('#ingredient-add');
  // On Add Click
  ingredientAdd.click(() => {
    addIngredient(ingredientInput, ingredientList);
  })
  // On Enter Press
  ingredientInput.keypress((event) => {
    if (event.which == 13 && ingredientInput.val() != "") {
      addIngredient(ingredientInput, ingredientList);
      event.preventDefault();
    } else if (event.which == 13 && ingredientInput.val() === "") {
      event.preventDefault();
    }
  })

  // Add items to procedure list
  let procedureList = form.find('#procedure-list');
  let procedureInput = form.find('#procedure-input');
  let procedureAdd = form.find('#procedure-add');
  // On Add Click
  procedureAdd.click(() => {
    addIngredient(procedureInput, procedureList);
  })
  procedureInput.keypress((event) => {
    if (event.which == 13 && procedureInput.val() != "") {
      addIngredient(procedureInput, procedureList);
      event.preventDefault();
    } else if (event.which == 13 && procedureInput.val() === "") {
      event.preventDefault();
    }
  })

  let formElement = form.find('form');
  formElement.on('submit', (event) => {
    event.preventDefault();

    // Download file
    const blob = new Blob([droppedFile]);
    const objectUrl = window.URL.createObjectURL(blob);

    const newRecipe = {
      category: form.find('#category').val() != "" ? form.find('#category').val() : null,
      description: form.find('#description').val() != "" ? form.find('#description').val() : null,
      estimatedTime: form.find('#time').val() != "" ? form.find('#time').val() : null,
      imageName: objectUrl && droppedFile ? objectUrl : null,
      ingredients: retrieveListItems(ingredientList),
      procedure: retrieveListItems(procedureList),
      subcategory: form.find('#subcategory').val() != "" ? form.find('#subcategory').val() : null,
      title: form.find('#title').val(),
      times: null,
      isFavorite: isFavorite
    }
    recipes.push(newRecipe);
    renderRecipes(recipes);

    // Close the modal
    form.remove();
    $('body').removeClass('noscroll');
  })


  let listContainer = $('div.list-container');
  form.insertAfter(listContainer);
}

function retrieveListItems(list) {
  let string = '';
  const listItems = list.find('li');
  listItems.each((index, element) => {
    let step = $(element).find('p').text();
    string = string + step + '|';
  })
  return string.slice(0, -1);
}

// Function to add item to parent list
function addIngredient(input, parent) {
  const inputValue = input.val();
  input.val('');

  // Create new <li> with text and remove button
  let listItem = $(`<li class="list-item">
  <div class="list-item-contents">
    <p>${inputValue}<img src="./img/minus.png"/></p>
    </div>
    </li>`);
  let minusIcon = listItem.find('img');
  minusIcon.click((event) => {
    const target = $(event.target);
    let parentDiv = target.parents('.list-item');
    parentDiv.remove();
  })
  listItem.appendTo(parent);
}

// Returns True if string ends with any of the given endings
function endsWithAny(string, endings) {
  return endings.some(function (ending) {
    return string.endsWith(ending);
  })
}

// function searches for recipes given target string
function searchRecipes(target) {
  return recipes.filter(x => x.title.toLowerCase().includes(target.toLowerCase()));
}

// perform search
$(".search-button").click((event) => {
  event.preventDefault();
  let str = $(".search").val();
  if (str.length == 0) {
    renderRecipes(recipes);
  } else {
    renderRecipes(searchRecipes(str));
  }
});

// render favorites and render all
$(".topbar > .nav > .favorite").click(() => {
  $(".favorite").addClass("selected");
  $(".all").removeClass("selected");
  renderRecipes(recipes.filter(x => x.isFavorite));
});
$(".topbar > .nav > .all").click(() => {
  $(".favorite").removeClass("selected");
  $(".all").addClass("selected");
  renderRecipes(recipes);
});