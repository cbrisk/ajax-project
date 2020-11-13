var $form1 = document.querySelector('.form-one');
var $form2 = document.querySelector('.form-two');
var $views = document.querySelectorAll('div.view');
var $header1 = document.querySelector('h3.city');
var $results = document.querySelector('div[data-view="results"]');
var $tablerow = $results.querySelectorAll('.table-row');
var $compareResults = document.querySelector('div[data-view="compare-results"]');
var $tablerowCompare = $compareResults.querySelectorAll('.table-row');

var city1 = null;
var $radio1 = null;
var $cityDisplay1 = null;
var city2 = null;
var $radio2 = null;
var $cityDisplay2 = null;

window.addEventListener('submit', function (event) {
  if (event.target.matches('.form-one')) {
    event.preventDefault();
    if (url === null) {
      city1 = $form1.elements.city.value;
      $radio1 = document.querySelector('input[name="city"]:checked');
      $header1.textContent = $radio1.nextElementSibling.firstChild.textContent;
      url = 'https://api.teleport.org/api/urban_areas/slug:' + city1 + '/scores/';
    } else {
      $header1.textContent = $form1.elements.usercity.value;
    }
    $form1.reset();
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.responseType = 'json';
    xhr.addEventListener('load', function () {
      data.firstCity = xhr.response;
      for (var j = 0; j < data.firstCity.categories.length; j++) {
        $tablerow[j].children[1].textContent = Math.round(data.firstCity.categories[j].score_out_of_10);
      }
    });
    xhr.send();
    viewSwapping('results');
    $favButton.textContent = 'Add to favorites';
  } else if (event.target.matches('.form-two')) {
    event.preventDefault();
    city1 = $form2.elements.city.value;
    $radio1 = document.querySelector('input[name="city"]:checked');
    $cityDisplay1 = $radio1.nextElementSibling.firstChild.textContent;
    city2 = $form2.elements.city2.value;
    $radio2 = document.querySelector('input[name="city2"]:checked');
    $cityDisplay2 = $radio2.nextElementSibling.firstChild.textContent;
    $form2.reset();
    for (var o = 0; o < $form2FirstColumnElements.length; o++) {
      $form2FirstColumnElements[o].disabled = false;
      $form2SecondColumnElements[o].disabled = false;
    }
    xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://api.teleport.org/api/urban_areas/slug:' + city1 + '/scores/');
    xhr.responseType = 'json';
    xhr.addEventListener('load', function () {
      data.firstCity = xhr.response;
      for (var j = 0; j < data.firstCity.categories.length; j++) {
        $tablerowCompare[j].children[1].textContent = Math.round(data.firstCity.categories[j].score_out_of_10);
      }
      var xhr2 = new XMLHttpRequest();
      xhr2.open('GET', 'https://api.teleport.org/api/urban_areas/slug:' + city2 + '/scores/');
      xhr2.responseType = 'json';
      xhr2.addEventListener('load', function () {
        data.secondCity = xhr2.response;
        for (j = 0; j < data.secondCity.categories.length; j++) {
          $tablerowCompare[j].children[2].textContent = Math.round(data.secondCity.categories[j].score_out_of_10);
          if (Math.round(data.secondCity.categories[j].score_out_of_10) > Math.round(data.firstCity.categories[j].score_out_of_10)) {
            $tablerowCompare[j].children[2].className = 'green';
            $tablerowCompare[j].children[1].className = 'red';
          } else if (Math.round(data.secondCity.categories[j].score_out_of_10) < Math.round(data.firstCity.categories[j].score_out_of_10)) {
            $tablerowCompare[j].children[2].className = 'red';
            $tablerowCompare[j].children[1].className = 'green';
          } else {
            $tablerowCompare[j].children[2].className = 'black';
            $tablerowCompare[j].children[1].className = 'black';
          }
        }
      });
      xhr2.send();
    });
    xhr.send();
    var $tdFirst = document.querySelector('.first-city');
    var $tdSecond = document.querySelector('.second-city');
    $tdFirst.textContent = $cityDisplay1;
    $tdSecond.textContent = $cityDisplay2;
    viewSwapping('compare-results');
  }
});

var $favButton = document.querySelector('button.favorite');

window.addEventListener('click', function (event) {
  if (!event.target.matches('a.link') && !event.target.matches('button')) {
    return;
  }
  if (event.target.matches('a.link')) {
    viewSwapping(event.target.getAttribute('data-view'));
    $message.classList.add('nonvisible');
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

var id = null;
var url = null;
var $message = document.querySelector('span.message');
var $buttonResults = $form1.querySelector('button.results');

$form1.addEventListener('input', function (event) {
  if (event.target.matches('input[name="usercity"]')) {
    $buttonResults.disabled = true;
    clearTimeout(id);
    id = setTimeout(function () {
      var xhr = new XMLHttpRequest();
      xhr.open('GET', 'https://api.teleport.org/api/urban_areas/');
      xhr.responseType = 'json';
      xhr.addEventListener('load', function () {
        data.cityOptions = xhr.response;
        var items = data.cityOptions._links['ua:item'];
        for (var j = 0; j < items.length; j++) {
          if ($form1.elements.usercity.value === items[j].name) {
            $message.classList.add('nonvisible');
            url = items[j].href + 'scores/';
            break;
          }
          $message.classList.remove('nonvisible');
        }
      });
      xhr.send();
      $buttonResults.disabled = false;
    }, 5000);
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
