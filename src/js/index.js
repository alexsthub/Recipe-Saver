'use strict';

// Fetch data
let recipes;
fetch('./jsonData.json')
  .then((response) => {
    return response.json();
  })
  .catch((error) => {
    console.log(error.message);
  })
  .then((data) => {
    recipes = data;
    console.log(recipes);
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
    <p>${inputValue}</p>
    <img src="./img/minus.png"/>
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





// Visually handle file input. Modified code from source.
/*
	By Osvaldas Valutis, www.osvaldas.info
	Available for use under the MIT License
*/
let droppedFile;
;
(function ($) {
  $('.input-file').each(function () {
    var $input = $(this),
      $label = $input.next('label'),
      labelVal = $label.html();

    $input.on('change', function () {
      var fileName = '';
      droppedFile = this.files[0];
      fileName = droppedFile.name;
        
      if (fileName)
        $label.find('span').html(fileName);
      else
        $label.html(labelVal);
    });
  });
})(jQuery, window, document);

// Handle drag input
var droppedFiles = false;
let form = $('div.box');
form.on('drag dragstart dragend dragover dragenter dragleave drop', function(e) {
  e.preventDefault();
  e.stopPropagation();
})
.on('dragover dragenter', function() {
  form.addClass('is-dragover');
})
.on('dragleave dragend drop', function() {
  form.removeClass('is-dragover');
})
.on('drop', function(e) {
  droppedFile = e.originalEvent.dataTransfer.files[0];
  var fileName = droppedFile.name;
  $('.input-clickable span').html(fileName);
});





