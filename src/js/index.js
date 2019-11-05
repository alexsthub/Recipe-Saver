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
    let recipes = data.response;
    // Sort by title
    recipes.sort((a, b) => {
      var textA = a.title.toUpperCase();
      var textB = b.title.toUpperCase();
      return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
    })
    renderRecipes(recipes);
  })

function renderRecipes(recipes) {
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
    if (letter > container.id) {
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





let formOverlay = $('div.form-overlay');
let body = $('body');
// Handle Add recipe button
$('div.fab').click(() => {
  formOverlay.removeClass('hidden');
  body.addClass('noscroll')
})

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