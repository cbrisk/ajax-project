var $form1 = document.querySelector('.form-one');
// var $header = document.querySelector('h3.city');

window.addEventListener('submit', function (event) {
  if (event.target.matches('button.results')) {
    event.preventDefault();
    var city = $form1.elements.city.value;
    // var $cityDisplay = document.querySelector('input[name="city"]:checked').nextSibling.textContent;
    $form1.reset();
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://api.teleport.org/api/urban_areas/slug:' + city + '/scores/');
    xhr.responseType = 'json';
    xhr.addEventListener('load', function () {
      data.firstCity = xhr.response;
    });
    xhr.send();

  }
});
