var $form1 = document.querySelector('.form-one');
var $form2 = document.querySelector('.form-two');
var $views = document.querySelectorAll('div.view');
var $header1 = document.querySelector('h3.city');
var $results = document.querySelector('div[data-view="results"]');
var $tablerow = $results.querySelectorAll('.table-row');
var $compareResults = document.querySelector('div[data-view="compare-results"]');
var $tablerowCompare = $compareResults.querySelectorAll('.table-row');
var $summary = document.querySelector('span.summary');
var $background = document.querySelector('div.background');
var $modalMessage = document.querySelector('div.modal h3');
var $divSpinner = document.querySelector('div.spinner');
var $divSpinner2 = document.querySelector('div.spinner2');

var city1 = null;
var $radio1 = null;
var $cityDisplay1 = null;
var city2 = null;
var $radio2 = null;
var $cityDisplay2 = null;

window.addEventListener('submit', function (event) {
  if (event.target.matches('.form-one')) {
    event.preventDefault();
    if (url === null && $form1.querySelector('input[name="city"]:checked') === null) { // If user hasn't selected anything, exit function
      return;
    }
    if (url === null) { // If url has not been set with the textbox search
      city1 = $form1.elements.city.value;
      $radio1 = $form1.querySelector('input[name="city"]:checked');
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
      if (xhr.status !== 200) {
        $background.classList.remove('hidden');
        $modalMessage.textContent = 'No data received';
        $form1.disabled = false;
        $divSpinner.classList.add('nonvisible');
        return;
      }
      data.firstCity = xhr.response;
      for (var j = 0; j < data.firstCity.categories.length; j++) {
        $tablerow[j].children[1].textContent = Math.round(data.firstCity.categories[j].score_out_of_10);
      }
      $summary.innerHTML = data.firstCity.summary; // Removes the undesirable HTML markup from response
      var transfer = $summary.textContent;
      $summary.textContent = transfer;
      $form1.disabled = false;
      $favButton.textContent = 'Add to favorites';
      url = null; // Reset the url
      $divSpinner.classList.add('nonvisible');
      viewSwapping('results');
    });
    xhr.addEventListener('error', function () {
      $background.classList.remove('hidden');
      $modalMessage.textContent = 'No network connection';
      $divSpinner.classList.add('nonvisible');
    });
    xhr.send();
    $form1.disabled = true; // Disables the form during network request
    $divSpinner.classList.remove('nonvisible');
  } else if (event.target.matches('.form-two')) {
    event.preventDefault();
    // If user hasn't selected 2 cities, exit function
    if (document.querySelector('input[name="city"]:checked') === null || document.querySelector('input[name="city2"]:checked') === null) {
      return;
    }
    city1 = $form2.elements.city.value;
    $radio1 = document.querySelector('input[name="city"]:checked');
    $cityDisplay1 = $radio1.nextElementSibling.firstChild.textContent;
    city2 = $form2.elements.city2.value;
    $radio2 = document.querySelector('input[name="city2"]:checked');
    $cityDisplay2 = $radio2.nextElementSibling.firstChild.textContent;
    $form2.reset();
    for (var o = 0; o < $form2FirstColumnElements.length; o++) { // Resets any disabled radio buttons
      $form2FirstColumnElements[o].disabled = false;
      $form2SecondColumnElements[o].disabled = false;
    }
    xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://api.teleport.org/api/urban_areas/slug:' + city1 + '/scores/');
    xhr.responseType = 'json';
    xhr.addEventListener('load', function () {
      if (xhr.status !== 200) {
        $background.classList.remove('hidden');
        $modalMessage.textContent = 'No data received';
        $form2.disabled = false;
        $divSpinner2.classList.add('nonvisible');

        return;
      }
      data.firstCity = xhr.response;
      for (var j = 0; j < data.firstCity.categories.length; j++) {
        $tablerowCompare[j].children[1].textContent = Math.round(data.firstCity.categories[j].score_out_of_10);
      }
      var xhr2 = new XMLHttpRequest();
      xhr2.open('GET', 'https://api.teleport.org/api/urban_areas/slug:' + city2 + '/scores/');
      xhr2.responseType = 'json';
      xhr2.addEventListener('load', function () {
        if (xhr2.status !== 200) {
          $background.classList.remove('hidden');
          $modalMessage.textContent = 'No data received';
          $form2.disabled = false;
          $divSpinner2.classList.add('nonvisible');

          return;
        }
        data.secondCity = xhr2.response;
        for (j = 0; j < data.secondCity.categories.length; j++) {
          $tablerowCompare[j].children[2].textContent = Math.round(data.secondCity.categories[j].score_out_of_10);
          // Compares the two results for color coding
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
        $form2.disabled = false;
        var $tdFirst = document.querySelector('.first-city');
        var $tdSecond = document.querySelector('.second-city');
        $tdFirst.textContent = $cityDisplay1;
        $tdSecond.textContent = $cityDisplay2;
        $divSpinner2.classList.add('nonvisible');
        viewSwapping('compare-results');
      });
      xhr2.addEventListener('error', function () {
        $background.classList.remove('hidden');
        $modalMessage.textContent = 'No network connection';
        $divSpinner2.classList.add('nonvisible');
      });
      xhr2.send();
    });
    xhr.addEventListener('error', function () {
      $background.classList.remove('hidden');
      $modalMessage.textContent = 'No network connection';
      $divSpinner2.classList.add('nonvisible');
    });
    xhr.send();
    $form2.disabled = true;
    $divSpinner2.classList.remove('nonvisible');
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
    if (data.favoriteCities.indexOf($header1.textContent) === -1) { // If city is not listed in favorite cities, add it now
      data.favoriteCities.push($header1.textContent);
    }
  } else if (event.target.matches('button.remove')) {
    var $listItems = document.querySelectorAll('li');
    for (var l = 0; l < $listItems.length; l++) {
      if (event.target.closest('li') === $listItems[l]) { // Removes the requested city from data model and DOM
        data.favoriteCities.splice(l, 1);
        $listItems[l].remove();
      }
    }
    if (!data.favoriteCities.length) {
      $noFav.textContent = 'Sorry, no favorite cities found.';
      $noFav.classList.remove('hidden');
    }
  } else if (event.target.matches('button.ok')) { // Ok button to acknowledge errors
    $background.classList.add('hidden');
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
  // Iterates through opposite column clicked, and disables corresponding city, reenables any other cities
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

$form1.addEventListener('input', function (event) {
  if (event.target.matches('input[name="usercity"]')) {
    $divSpinner.classList.remove('nonvisible');
    $message.classList.add('nonvisible');
    clearTimeout(id);
    id = setTimeout(function () { // Waits 5 secs to check whether input is a valid city
      var xhr = new XMLHttpRequest();
      xhr.open('GET', 'https://api.teleport.org/api/urban_areas/');
      xhr.responseType = 'json';
      xhr.addEventListener('load', function () {
        data.cityOptions = xhr.response;
        var items = data.cityOptions._links['ua:item'];
        for (var j = 0; j < items.length; j++) {
          if ($form1.elements.usercity.value.toLowerCase().includes(items[j].name.toLowerCase())) {
            url = items[j].href + 'scores/';
            $message.classList.add('nonvisible');
            break;
          }
          $message.classList.remove('nonvisible');
        }
        $form1.disabled = false;
        $divSpinner.classList.add('nonvisible');
      });
      xhr.send();
      $form1.disabled = true; // Disables the form during network request
    }, 5000);
  }
});

var $favList = document.querySelector('ol.fav-list');
var $noFav = document.querySelector('h5');

function viewSwapping(dataView) {
  for (var i = 0; i < $views.length; i++) {
    if ($views[i].getAttribute('data-view') === dataView) {
      $views[i].classList.remove('hidden');
    } else {
      $views[i].classList.add('hidden');
    }
  }
  if (dataView === 'favorites') {
    $favList.innerHTML = ''; // Clears out the list before repopulating based on what is currently in the data model
    if (data.favoriteCities.length === 0) {
      $noFav.textContent = 'Sorry, no favorite cities found.';
      $noFav.classList.remove('hidden');
    } else {
      $noFav.classList.add('hidden');
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
  }
  data.view = dataView; // Sets the view in the data model
}
