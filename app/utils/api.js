var axios = require('axios');

var id = 'YOUR_CLIENT_ID';
var sec = 'YOUR_SECRET_ID';
var params = "?client_id=" + id + "&client_secret=" + sec;

function getProfile(username){
	return axios.get("https://api.github.com/users" + username + params)
		.then(function(user){
			return user.data;
		});
}

function getRepos(username){
	return axios.get("https://api.github.com/users" + username + '/repos' + params +
		'&per_page=100')
}

//function sums all stars
//second time function runs, count will be number of stars 
//in first repo... second time will be sum of stars of first two repos
function getStarCount(repos) {
	return repos.data.reduce(function (count, repo){
		return count + repo.stargazers_count;
	},0)
}

function calculateScore(profile, repos){
	var followers = profile.followers;
	var totalStars = getStarCount(repos);

	return (followers * 3) + totalStars;
}

function handleError(error){
	console.warn(error);
	return null;
}

function getUserData(player){
	//async call getProfile and getRepos
	return axios.all([
		getProfile(player),
		getRepos(player)
		//once both of these resolve, the then function runs
	]).then(function(data){
		//array elements are ordered based on ordering passed to axios.all
		var profile = data[0]
		var repos = data[1]

		return {
			profile: profile,
			score: calculateScore(profile, repos)
		}
	})
}

function SortPlayers(players){
	//returns brand new array with player with higher score
	return players.sort(function(a,b){
		return b.score-a.score;
	})
}

module.exports = {
	//Battle will return a promise that will resolve with all player info
	battle: function(players) {
		//players.map:
				//map over players, where every new item in array 
				//is object with profile and score
				//each item in array is a promise because of chaining
		//pass to sortPlayers function
		return axios.all(players.map(getUserData))
			.then(sortPlayers)
			.catch(handleError) //if error, pass to handleError function
	},
	fetchPopularRepos: function (language) {
		var encodedURI = window.encodeURI('https://api.github.com/search/repositories?q=stars:>1+language:'+ language + '&sort=stars&order=desc&type=Repositories');

    return axios.get(encodedURI)
      .then(function (response) {
        return response.data.items;
     });
	}
};