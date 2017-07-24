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
        console.log("language not found, set to default language");
    }
    
    // get user location
    if (navigator.geolocation){
        navigator.geolocation.getCurrentPosition(getPosition);
    }
    else{
        console.log("Geolocation is not supported by this browser");
        console.log("Using browser to determine location ...");
        country = lang.slice(-2);
        console.log(country);
    }

    categoryDOM = $('#category');
    $.each(categorykeys, function(){
        categoryDOM.append($("<option />").val(this).text(listCategories[this]));
    });
    categoryDOM.addClass("ui search dropdown optionsstyle");
    
    $('#category').dropdown({
        onChange: function () {
            category = categoryDOM.val();
            console.log("getting news for " + lang + country + category);
            getSources(lang, country, category)
        }
    });
}

//**************** Functions used in loadData() ****************//

// get lat, long of user
var getPosition = function(position){
    lat = position.coords.latitude;
    long = position.coords.longitude;
    getCountry(lat, long);
}

// convert lat, long to country
var getCountry = function(la, lo){
    requrl = "http://ws.geonames.org/countryCodeJSON?lat=" + la + "&lng=" + lo + "&username=veracity";
    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", requrl, false);
    //xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send();
    var response = JSON.parse(xhttp.responseText);
    country = response['countryCode'].toLowerCase();
    console.log(country);
}

// get news sources for a specific language, country, and category
var getSources = function (la, cty, cat) {
    requrl = "https://newsapi.org/v1/sources?language=" + la + "&country=" + cty + "&category=" + cat;
    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", requrl, false);
    xhttp.send();
    var response = JSON.parse(xhttp.responseText);
    console.log(response);
    var sources = response['sources']
    var sourceIDs = []
    for (var source in sources){
        sourceIDs.push(source['id']);
    }
}