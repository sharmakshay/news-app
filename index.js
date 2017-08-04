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

// main function -- gets user language, location, chosen category of news and populates DOM accordingly
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
            var allarticles = {}
            var category = categoryDOM.val();
            console.log("getting news for " + lang + country + category);
            
            // get all relevant sources
            var sourceIDs = getSources(lang, country, category);

            // get articles for each source
            $.each(sourceIDs, function(){
                var articles = getArticles(this, "top");
                allarticles[this] = articles;
                console.log(allarticles);
            });
            clearDOM();
            populateDOM(allarticles);
        }
    });
}

// ****************************** Helper functions used in loadData() ****************************** //

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

// Populate articles into DOM
var populateDOM = function (articles){
     var sources = Object.keys(articles);
     newsDOM = $('#news-container');
     //console.log(sources);
    $.each(sources, function(){
        sourcearticles = articles[this];
        $.each(sourcearticles, function(){
            var author = this.author;
            var description = this.description;
            var timestamp = this.publishedAt;
            var title = this.title;
            var articleURL = this.url;
            var imgURL = this.urlToImage;
            
            // ARTICLE
            var articledivDOM = $("<div/>") 
                .addClass("ui centered card");
            
            // ARTICLE - DIVIMAGE
            var articleimgdivDOM = $("<div/>")
                .addClass("image");

            // ARTICLE - DIVIMAGE - IMAGE
            var articleimgDOM = $("<img/>")
                .attr("src", imgURL);
            
            // add image to article div
            articleimgdivDOM.append(articleimgDOM);
            articledivDOM.append(articleimgdivDOM);

            // ARTICLE - CONTENT
            var articlecontentdivDOM = $("<div/>")
                .addClass("content");

            // ARTICLE - CONTENT - HEADER
            var articleheaderDOM = $("<a/>")
                .addClass("header")
                .attr("href", articleURL)
                .attr("target", "_blank")
                .text(title);
            
            // add header to content div
            articlecontentdivDOM.append(articleheaderDOM);

            // ARTICLE - CONTENT - AUTHORS
            var articleauthordivDOM = $("<div/>")
                .addClass("meta");

            // ARTICLE - CONTENT - AUTHORS - AUTHORS TEXT
            // var articleauthorDOM = $("<p/>")
            //     .text(author);
            
            // // add authors to content div
            // articleauthordivDOM.append(articleauthorDOM);
            // articlecontentdivDOM.append(articleauthordivDOM);

            // if (!description.includes("...")){
            //     // ARTICLE - CONTENT - DESCRIPTION
            //     var articledescripdivDOM = $("<div/>")
            //         .addClass("description")
            //         .text(description);
                
            //     // add description to content
            //     articlecontentdivDOM.append(articledescripdivDOM);
            // }

            // ARTICLE - EXTRA CONTENT - TIME
            var currTime = new Date();
            var articletime = parseInt(currTime - timestamp)/1000;

            var articleextracontentdivDOM = $("<div/>")
                .addClass("extra content");

            var articletimeDOM = $("<span/>")
                .addClass("right floated")
                .text(author);

            // add time to content
            articleextracontentdivDOM.append(articletimeDOM);

            // add content and extra content to article
            articledivDOM.append(articlecontentdivDOM);
            //articledivDOM.append(articleextracontentdivDOM);
            newsDOM.append(articledivDOM);

            //categoryDOM.append($("<option />").val(this).text(listCategories[this]));
        });
    });
}

var clearDOM = function(){
    $('#news-container').empty();
}