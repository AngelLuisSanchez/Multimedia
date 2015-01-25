
$(document).ready(function(){

  // Funciones de inicio al entrar en distintas secciones
  $(document).on("pageshow","#LLEVAME", initMap);
  $(document).on("pageshow","#SUBIRFOTOS", tomarFoto);
  $(document).on("pageshow","#PROGRESO", mostrarFotos);

  $("#map-canvas").css("height", $("#LLEVAME").height()-35-25);

  document.addEventListener("deviceready", init);

  document.addEventListener("offline", function() {
    navigator.notification.alert("Acabas de perder la conexión a internet. Ten en cuenta que secciones que lo utilizan tales como el mapa pueden verse afectadas", null, "Sin conexión", "Aceptar");
  });

});

// Ejecución al tener el dispositivo listo
function init(){
  console.log('Device Ready');
}

var directionsDisplay;
var directionsService = new google.maps.DirectionsService();
var map;

// Pintar Mapa
function initMap(){
  console.log('Init Map');
  directionsDisplay = new google.maps.DirectionsRenderer();
  var galeria = new google.maps.LatLng(38.688389116143654, -4.109042756340223);
  var mapOptions = {
    zoom:7,
    center: galeria
  };
  map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
  directionsDisplay.setMap(map);
  navigator.geolocation.getCurrentPosition(posicionado, fallo);
}

function posicionado(posicion) {
  console.log('Posicionado: ' + posicion.coords.latitude + ", " + posicion.coords.longitude);
  var posX = posicion.coords.latitude;
  var posY = posicion.coords.longitude;
  calcRoute(posX, posY);
}

function calcRoute(x,y) {
  console.log('Calc Route');
  var start = new google.maps.LatLng(x,y);
  var end = new google.maps.LatLng(38.688389116143654, -4.109042756340223);

  var request = {
      origin:start,
      destination:end,
      travelMode: google.maps.TravelMode.DRIVING
  };
  directionsService.route(request, function(response, status) {
    if (status == google.maps.DirectionsStatus.OK) {
      directionsDisplay.setDirections(response);
    }
  });
}

function fallo(error) {
    navigator.notification.alert("No se ha podido realizar la acción, por favor active su GPS", null, "Error", "Aceptar");
}

function tomarFoto() {
  navigator.camera.getPicture(fotoTomada, fallo, {quality: 50, destinationType: navigator.camera.DestinationType.FILE_URI });
}

function fotoTomada(imageURI) {
  var imagen = imageURI;

  var indice = localStorage.getItem("numFotos");
  if((indice == "undefined") || (indice == null)) {
    localStorage.setItem("numFotos", "0");
    indice = "0";
  }

  indice = parseInt(indice);
  indice++;

  localStorage.setItem("imagen" + indice, imagen);
  localStorage.setItem("numFotos", indice);
}

function mostrarFotos() {
  var actual = localStorage.getItem("actual");
  if ((actual == "undefined") || (actual == null)) {
    localStorage.setItem("actual", "1");
    actual = "1";
  }

  var imagen = localStorage.getItem("imagen" + actual);
  
  var marco = document.getElementById('galeria');
  marco.src = imagen;
}

function anterior() {
  var actual = localStorage.getItem("actual");
  if ((actual == "undefined") || (actual == null)) {
    localStorage.setItem("actual", "1");
    actual = "1";
  }

  actual = parseInt(actual);

  if(actual >= 2){
    actual--;
    localStorage.setItem("actual", actual);
    mostrarFotos();
  }
}

function siguiente() {
  var actual = localStorage.getItem("actual");
  if ((actual == "undefined") || (actual == null)) {
    localStorage.setItem("actual", "1");
    actual = "1";
  }

  actual = parseInt(actual);
  if (actual < localStorage.getItem("numFotos")) {
    actual++;
    localStorage.setItem("actual", actual);
    mostrarFotos();
  }
}