var $form1 = document.querySelector('.form-one');
var $views = document.querySelectorAll('div.view');
var $header1 = document.querySelector('h3.city');
var $tablerow = document.querySelectorAll('.table-row');
var $cityDisplay = null;

window.addEventListener('submit', function (event) {
  if (event.target.matches('.form-one')) {
    event.preventDefault();
    var city = $form1.elements.city.value;
    var $radio = document.querySelector('input[name="city"]:checked');
    $cityDisplay = $radio.nextElementSibling.firstChild.textContent;
    $form1.reset();
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://api.teleport.org/api/urban_areas/slug:' + city + '/scores/');
    xhr.responseType = 'json';
    xhr.addEventListener('load', function () {
      data.firstCity = xhr.response;
      for (var j = 0; j < data.firstCity.categories.length; j++) {
        $tablerow[j].children[1].textContent = Math.round(data.firstCity.categories[j].score_out_of_10);
      }
    });
    xhr.send();
    $header1.textContent = $cityDisplay;
    viewSwapping('results');
    $favButton.textContent = 'Add to favorites';
  }
});

var $favButton = document.querySelector('button.favorite');

window.addEventListener('click', function (event) {
  if (!event.target.matches('a.link') && !event.target.matches('button')) {
    return;
  }
  if (event.target.matches('a.link')) {
    viewSwapping(event.target.getAttribute('data-view'));
  } else if (event.target.matches('button.favorite')) {
    $favButton.textContent = '✔ Added!';
    if (data.favoriteCities.indexOf($cityDisplay) === -1) {
      data.favoriteCities.push($cityDisplay);
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
