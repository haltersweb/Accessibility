var theUrlForTheJsonData = "http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=AB5F2B2D478D8FDC601701509B768B61&steamids=76561197960435530,76561198152299810,76561197972495328";
  // NOTE: for any Steam data url to work you will need to use a web proxy such as Charles
  // and rewrite the header to add Access-Control-Allow-Origin = *
  // this is because Steam doesn't support JSONP
  // ultimately, this request would have to come from the server, not client-side
  // also note, this is my personal Steam key.  You will need to get your own.  Do not share it with others.



$.getJSON(theUrlForTheJsonData, function( data ) {
	//the variable data is the JSON data returned from the url I passed
	//here you can see that data in object form
	console.log(data);

	//I only want the players object so I am drilling down into the JSON and only passing that object
	//Then I will pass the players object into a function called createListOfUsers()
	createListOfUsers(data.response.players);
});

//this function will take my JSON data as the parameter
function createListOfUsers(userData) {

	//I am saving the DOM object that has the id "listOfStuff" in a variable called "$list"
	//BTW, whenever I start a variable name with "$" it means that this variable holds a jQuery object
	var $list = $('#listOfStuff');

	//I am putting a paragraph before my list that will mention how many players I am listing
	//I get this number by taking the length of the userData
	$list.before('<p>Here is information on ' + userData.length + ' members.</p>');

	//now I will start making my list inside of the #listOfStuff (saved as var $list)
	//I start looping through each JSON object inside of userData
	//The parameters that the function $.each passes into the anonymous function are:
		// key: either the index or the object name that corresponds to the current object inside of userData
		// since this is an array the key is the index starting at 0 of the current object
		// value: this is the current object inside of userData
	$.each(userData, function( key, value ) {

		//I am now creating a jQuery variable that is an empty paragraph
		var $listItem = $("<p></p>");

		//I shall now start appending content inside of this empty paragraph
		$listItem
			 // first a number made from key + 1 (that way my list starts at 1 not 0)
			.append((key + 1) + ' ')
			 // followed by the player's avatar.  I used the url found under the object called "avatar" for the img src
			.append('<img src="' + value.avatar + '" /> ')
			 // followed by the username of the player (the "personaname" object)
			 // this name is wrapped in a link to that player's profile (via the "profileurl" object)
			.append('<span class="name"><a href="' + value.profileurl + '">' + value.personaname + '</span></a>')
			 // finally I am saving the players stream ID in a data attribute in case I need it later.
			.attr('data-steamid', value.steamid);

		// finally I am appending this paragraph into that $list
		$list.append($listItem);

	// this will happen over and over until the function gets to the last item of the userData
	});
}






/*
STEAM DEV COMMUNITY (request key, links to API, etc.):
https://steamcommunity.com/dev/
STEAM WEB API:
https://developer.valvesoftware.com/wiki/Steam_Web_API
SOME OTHER JSON LINKS:
	GET OWNED GAMES FOR A PLAYER:
	http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=AB5F2B2D478D8FDC601701509B768B61&steamid=76561197960435530&format=json
	GET A PLAYER'S USER STATS FOR GAME:
	http://api.steampowered.com/ISteamUserStats/GetUserStatsForGame/v0002/?appid=440&key=AB5F2B2D478D8FDC601701509B768B61&steamid=76561197972495328
	GET PLAYER SUMMARIES (this one can take multiple comma delimited players):
	http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=AB5F2B2D478D8FDC601701509B768B61&steamids=76561197960435530,76561198152299810,76561197972495328
*/

/*
OTHER JSON TEST CODE

	$.getJSON("js/some-json.js", function( data ) {
	  console.log(data);
	});

	$.getJSON("js/stream-json.js", function( data ) {
	  console.log(data.response.players);
	});

	$.ajax({
	  url: "http://www3.septa.org/hackathon/locations/get_locations.php?lon=-75.161&lat=39.95205&callback=?",
	  dataType: "jsonp",
	  success: function(data){
	    console.log(data);
	  }
	});
*/