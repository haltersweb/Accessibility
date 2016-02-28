$.getJSON( "http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=AB5F2B2D478D8FDC601701509B768B61&steamids=76561197960435530,76561198152299810,76561197972495328", function( data ) {
  // NOTE: for this to work you will need to use a web proxy such as Charles
  // and rewrite the header to add Access-Control-Allow-Origin = *
  // this is because Steam doesn't support JSONP
  // ultimately, this request would have to come from the server, not client-side
  // also note, this is my personal Steam key.  You will need to get your own.  Do not share it with others.
  console.log(data);
  createListOfUsers(data.response.players);
});

function createListOfUsers(userData) {
	var $list = $('#listOfStuff');
	$.each(userData, function( key, value ) {
		var $listItem = $("<p></p>");
		console.log( key + ": " + value );
		$listItem.append((key + 1) + ' ')
			.append('<img src="' + value.avatar + '" /> ')
			.append('<span class="name"><a href="' + value.profileurl + '">' + value.personaname + '</span></a>')
			.attr('data-steamid', value.steamid);
		$list.append($listItem);
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