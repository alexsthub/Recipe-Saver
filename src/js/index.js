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
    var textA = a.title.toUpperCase();
    var textB = b.title.toUpperCase();
    return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
  });
  // Delete all children
  let recipeContainer = $('div.list-container');
  recipeContainer.empty();

  recipes.forEach((recipe) => {
    var firstLetter = recipe.title.charAt(0).toUpperCase();
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

function addRecipeToList(parent, recipe) {
  let newRecipe = $(`
  <div class="recipe-group">
    <div class="recipe-letter-container">
      <div class="recipe">
        <img class="foodimage" alt="${recipe.title}" src="./recipeImages/${recipe.title}.jpg" />
        <div class="recipe-info">
          <div class="title-container">
            <p class="recipe-title">${recipe.title}</p>
            <img class="favoriteIcon" alt="favorite star icon" src="img/${recipe.isFavorite ? 'star-true' : 'star-false'}.png" />
          </div>
          <p class="recipe-description">${recipe.description}</p>
          <p>Category: ${recipe.category ? recipe.category : 'none'}</p>
          <p>Subcategory: ${recipe.subcategory ? recipe.subcategory : 'none'}</p>
        </div>
      </div>
    </div>
  </div>`)
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
      var $input = $(this),
        $label = $input.next('label'),
        labelVal = $label.html();

      $input.on('change', function () {
        if (this.files.length > 0) {
          var fileName = '';
          droppedFile = this.files[0];
          fileName = droppedFile.name;

          var span = $label.find('span');
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
      var fileName = droppedFile.name;
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

  // TODO: On enter for inputs is getting destroyed. Prevent Default on these and maybe try to implement tab behavior (change focus)
  // let standardInputs = form.find('input.standard-input');
  // standardInputs.forEach((input) => {
  //   input.keypress((event) => {
  //     if (event.which == 13) {
  //       event.preventDefault();
  //     }
  //   })
  // })

  // TODO: Submit form
  // TODO: Save image if exists
  let formElement = form.find('form');
  formElement.on('submit', (event) => {
    event.preventDefault();
    console.log(droppedFile);
    var newRecipe = {
      category: form.find('#category').val() != "" ? form.find('#category').val() : null,
      description: form.find('#description').val() != "" ? form.find('#description').val() : null,
      estimatedTime: form.find('#time').val() != "" ? form.find('#time').val() : null,
      imageName: droppedFile ? droppedFile.name : null,
      ingredients: retrieveListItems(ingredientList),
      procedure: retrieveListItems(procedureList),
      subcategory: form.find('#subcategory').val() != "" ? form.find('#subcategory').val() : null,
      title: form.find('#title').val(),
      times: null,
      isFavorite: isFavorite,
    }
    console.log(newRecipe);
  })


  let listContainer = $('div.list-container');
  form.insertAfter(listContainer);
}

function retrieveListItems(list) {
  let string = '';
  var listItems = list.find('li');
  listItems.each((index, element) => {
    let step = $(element).find('p').text();
    string = string + step + ',';
  })
  return string.slice(0, -1);
}
formOverlay.removeClass('hidden');
body.addClass('noscroll')

// Handle form close
$('span.close').click(() => {
  formOverlay.addClass('hidden');
  body.removeClass('noscroll');
})

// Add items to ingredients list
let ingredientList = $('#ingredient-list');
let ingredientInput = $('#ingredient-input');
let ingredientAdd = $('#ingredient-add');
// On Add Click
ingredientAdd.click(() => {
  addIngredient(ingredientInput, ingredientList);
})
// On Enter Press
ingredientInput.keypress((event) => {
  if (event.which == 13) {
    addIngredient(ingredientInput, ingredientList);
    event.preventDefault();
  }
})

// Add items to procedure list
let procedureList = $('#procedure-list');
let procedureInput = $('#procedure-input');
let procedureAdd = $('#procedure-add');
// On Add Click
procedureAdd.click(() => {
  addIngredient(procedureInput, procedureList);
})
procedureInput.keypress((event) => {
  if (event.which == 13) {
    addIngredient(procedureInput, procedureList);
    event.preventDefault();
  }
})

// Function to add item to parent list
function addIngredient(input, parent) {
  var inputValue = input.val();
  input.val('');

  // Create new <li> with text and remove button
  let listItem = $(`<li class="list-item">
  <div class="list-item-contents">
    <p>${inputValue}<img src="./img/minus.png"/></p>
    </div>
    </li>`);
  let minusIcon = listItem.find('img');
  minusIcon.click((event) => {
    var target = $(event.target);
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


// Visually handle file input. Modified code from source.
/*
  By Osvaldas Valutis, www.osvaldas.info
  Available for use under the MIT License
*/

let droppedFile;;
(function ($) {
  $('.input-file').each(function () {
    var $input = $(this),
      $label = $input.next('label'),
      labelVal = $label.html();

    $input.on('change', function () {
      console.log(this.files.length);
      if (this.files.length > 0) {
        var fileName = '';
        droppedFile = this.files[0];
        fileName = droppedFile.name;

        var span = $label.find('span');
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
var droppedFiles = false;
let form = $('div.box');
form.on('drag dragstart dragend dragover dragenter dragleave drop', function (e) {
    e.preventDefault();
    e.stopPropagation();
  })
  .on('dragover dragenter', function () {
    form.addClass('is-dragover');
  })
  .on('dragleave dragend drop', function () {
    form.removeClass('is-dragover');
  })
  .on('drop', function (e) {
    droppedFile = e.originalEvent.dataTransfer.files[0];
    var fileName = droppedFile.name;
    let span = $('.input-clickable span');
    if (endsWithAny(fileName, ['jpg', 'png', 'tif', 'svg'])) {
      span.html(fileName);
      span.removeClass('error-message');
    } else {
      span.html('Invalid File Type. Try again with an image.')
      span.addClass('error-message');
      droppedFile = null;
    }

  });

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

// toggle favorite
$("main").on("click", ".favoriteIcon", function () {
  console.log("favorite clicked");
  if ($(this).attr("src").includes("true")) {
    $(this).attr("src", "img/star-false.png");
  } else {
    $(this).attr("src", "img/star-true.png");
  }
  let name = $(this).siblings()[0].innerHTML;
  for (let i = 0; i < recipes.length; i++) {
    if (recipes[i].title == name) {
      recipes[i].isFavorite = !recipes[i].isFavorite;
      console.log(name + ": " + recipes[i].isFavorite);
      break;
    }
  }
});