/*
$.ajax({
  url: "http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=AB5F2B2D478D8FDC601701509B768B61&steamids=76561197960435530,76561198152299810",

 dataType: "jsonp",
 jsonp: false,
  success: function(data){
  	console.log(data);
  }
});

$.ajax({
  url: "http://json2jsonp.com/?http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=AB5F2B2D478D8FDC601701509B768B61&steamids=76561197960435530,76561198152299810&callback=?",

 dataType: "jsonp",
 jsonp: false,
  success: function(data){
    console.log(data);
  }
});
*/

/*
$.get( "http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=AB5F2B2D478D8FDC601701509B768B61&steamids=76561197960435530,76561198152299810", function( data ) {
  alert( "Load was performed." );
});
*/

$.get( "js/some-json.js", function( data ) {
  alert( "Load was performed." );
});

$.get( "js/stream-json.js", function( data ) {
  console.log(data.response.players);
});