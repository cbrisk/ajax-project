var $form1 = document.querySelector('.form-one');
var $form2 = document.querySelector('.form-two');
var $views = document.querySelectorAll('div.view');
var $header1 = document.querySelector('h3.city');
var $tablerow = document.querySelectorAll('.table-row');

var city1 = null;
var $radio1 = null;
var $cityDisplay1 = null;
// var city2 = null;
// var $radio2 = null;
// var $cityDisplay2 = null;

window.addEventListener('submit', function (event) {
  if (event.target.matches('.form-one')) {
    event.preventDefault();
    city1 = $form1.elements.city.value;
    $radio1 = document.querySelector('input[name="city"]:checked');
    $cityDisplay1 = $radio1.nextElementSibling.firstChild.textContent;
    $form1.reset();
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://api.teleport.org/api/urban_areas/slug:' + city1 + '/scores/');
    xhr.responseType = 'json';
    xhr.addEventListener('load', function () {
      data.firstCity = xhr.response;
      for (var j = 0; j < data.firstCity.categories.length; j++) {
        $tablerow[j].children[1].textContent = Math.round(data.firstCity.categories[j].score_out_of_10);
      }
    });
    xhr.send();
    $header1.textContent = $cityDisplay1;
    viewSwapping('results');
    $favButton.textContent = 'Add to favorites';
  } // else if (event.target.matches('.form-two')) {
  // Coming soon!
  // }
});

var $favButton = document.querySelector('button.favorite');

window.addEventListener('click', function (event) {
  if (!event.target.matches('a.link') && !event.target.matches('button')) {
    return;
  }
  if (event.target.matches('a.link')) {
    viewSwapping(event.target.getAttribute('data-view'));
    // Remove color classes with for loop
  } else if (event.target.matches('button.favorite')) {
    $favButton.textContent = '✔ Added!';
    if (data.favoriteCities.indexOf($cityDisplay1) === -1) {
      data.favoriteCities.push($cityDisplay1);
    }
  } else if (event.target.matches('button.remove')) {
    var $listItems = document.querySelectorAll('li');
    for (var l = 0; l < $listItems.length; l++) {
      if (event.target.closest('li') === $listItems[l]) {
        data.favoriteCities.splice(l, 1);
        $listItems[l].remove();
      }
    }
  }
});

var $form2FirstColumn = $form2.querySelector('.half-column:first-child');
var $form2FirstColumnElements = $form2.querySelectorAll('.half-column:first-child input');
var $form2SecondColumnElements = $form2.querySelectorAll('.half-column:nth-child(2) input');
var $column = null;

$form2.addEventListener('input', function (event) {
  $column = event.target.parentElement.parentElement;
  var clicked = null;
  var opposite = null;
  if ($column === $form2FirstColumn) {
    clicked = $form2FirstColumnElements;
    opposite = $form2SecondColumnElements;
  } else {
    clicked = $form2SecondColumnElements;
    opposite = $form2FirstColumnElements;
  }
  for (var m = 0; m < clicked.length; m++) {
    if (event.target === clicked[m]) {
      opposite[m].disabled = true;
    } else {
      opposite[m].disabled = false;
    }
  }
});

var $favList = document.querySelector('ol.fav-list');

function viewSwapping(dataView) {
  for (var i = 0; i < $views.length; i++) {
    if ($views[i].getAttribute('data-view') === dataView) {
      $views[i].classList.remove('hidden');
    } else {
      $views[i].classList.add('hidden');
    }
  }
  if (dataView === 'favorites') {
    $favList.innerHTML = '';
    for (var k = 0; k < data.favoriteCities.length; k++) {
      var $li = document.createElement('li');
      $li.textContent = data.favoriteCities[k];
      var $remove = document.createElement('button');
      $remove.className = 'remove';
      $remove.textContent = 'Remove';
      $li.appendChild($remove);
      $favList.appendChild($li);
    }
  }
  data.view = dataView;
}
