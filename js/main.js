var $form1 = document.querySelector('.form-one');

window.addEventListener('submit', function (event) {
  if (event.target.matches('button.results')) {
    var city = $form1.elements.city.value;
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://api.teleport.org/api/urban_areas/slug:' + city + '/scores/');
    xhr.responseType = 'json';
    xhr.send();
  }
});
