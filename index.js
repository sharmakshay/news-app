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

var country;

// initial setup
var loadData = function(){

    // get user language
    var lang = navigator.language;
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

    // add categories to select button
    categoryDOM = $('#category');
    $.each(categorykeys, function(){
        categoryDOM.append($("<option />").val(this).text(listCategories[this]));
    });
    categoryDOM.addClass("ui search dropdown optionsstyle");
    
    // on category change, get news sources, get articles, show articles in DOM
    $('#category').dropdown({
        onChange: function () {
            var allarticles = []
            var category = categoryDOM.val();
            console.log("getting news for " + lang + country + category);
            var sourceIDs = getSources(lang, country, category);
            //console.log(sourceIDs);
            //getArticles()
            $.each(sourceIDs, function(){
                var articles = getArticles(this, "top")
                //console.log(articles);
                allarticles.push(articles);
                console.log(allarticles);
            });
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

// *API CALL* convert lat, long to country
var getCountry = function(la, lo){
    requrl = "http://ws.geonames.org/countryCodeJSON?lat=" + la + "&lng=" + lo + "&username=veracity";
    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", requrl, false);
    xhttp.send();
    var response = JSON.parse(xhttp.responseText);
    country = response['countryCode'].toLowerCase();
}

// *API CALL* get news sources for a specific language, country, and category
var getSources = function (la, cty, cat) {
    var sids = []
    requrl = "https://newsapi.org/v1/sources?language=" + la + "&country=" + cty + "&category=" + cat;
    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", requrl, false);
    xhttp.send();
    var response = JSON.parse(xhttp.responseText);
    var sources = response['sources'];
    for (var s in sources){
        sids.push(sources[s].id);
    }
    return sids;
}

// *API CALL* get [top, latest, popular] articles for a given source
var getArticles = function (src, srt){
    requrl = "https://newsapi.org/v1/articles?source=" + src + "&sortBy=" + srt + "&apiKey=f44132c00c804786b61ba1137c1ec80f";
    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", requrl, false);
    xhttp.send();
    var response = JSON.parse(xhttp.responseText);
    var articles = response['articles'];
    return articles;
}