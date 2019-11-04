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








// Visually handle file input (I did not write this code)
/*
	By Osvaldas Valutis, www.osvaldas.info
	Available for use under the MIT License
*/
;
(function ($) {
  $('.input-file').each(function () {
    var $input = $(this),
      $label = $input.next('label'),
      labelVal = $label.html();

    $input.on('change', function (e) {
      var fileName = '';

      if (this.files && this.files.length > 1)
        fileName = (this.getAttribute('data-multiple-caption') || '').replace('{count}', this.files.length);
      else if (e.target.value)
        fileName = e.target.value.split('\\').pop();

      if (fileName)
        $label.find('span').html(fileName);
      else
        $label.html(labelVal);
    });
  });
})(jQuery, window, document);