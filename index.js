var listlanguages = {
    "en": "English",
    "de": "German",
    "fr": "French"
}

var listCountries = {
    "au": "Australia",
    "de": "Germany",
    "gb": "Great Britain",
    "in": "India",
    "it": "Italia",
    "us": "United States",
}

var listCategories = {
    "business": "Business",
    "entertainment": "Entertainment",
    "gaming": "Gaming",
    "general": "General",
    "music": "Music",
    "politics": "Politics",
    "science-and-nature": "Science and Nature",
    "sport": "Sport",
    "technology": "Technology"
}

const languaguekeys = Object.keys(listlanguages);
const countrykeys = Object.keys(listCountries);
const categorykeys = Object.keys(listCategories);

var lang;
var country;
var category;

var loadData = function(){

    // get user language
    lang = navigator.language;
    lang = lang.substring(0,2);
    if (!languaguekeys.includes(lang)){
        lang = "en";
    }
    
    // get user location
    if (navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPos);
    }
    else{
        console.log("Geolocation is not supported by this browser");
        console.log("Using browser to determine location ...");
        country = lang.slice(-2);
        console.log(country);
    }

    category = $('#category');
    $.each(categorykeys, function(){
        category.append($("<option />").val(this).text(listCategories[this]));
    });
    category.addClass("ui search dropdown optionsstyle");
    
    $('.ui.dropdown').dropdown();
}

// get lat, long of user
var showPos = function(position){
    lat = position.coords.latitude;
    long = position.coords.longitude;
    getCountry(lat, long);
}

// convert location to country
var getCountry = function(la, lo){
    requrl = "http://ws.geonames.org/countryCodeJSON?lat=" + la + "&lng=" + lo + "&username=veracity";
    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", requrl, false);
    //xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send();
    var response = JSON.parse(xhttp.responseText);
    console.log(response);
}