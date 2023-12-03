//TODO: get value of playlist and playlist image for local storage

var plannerSection = $('#planner-section')
var taskContainer = $('#task-container')
var addTaskButton = $('#add-task')
var submitButton = $('#submit')
// var inputBar = $('#input')
var form = $('#form')
var playlistContainer = $('#playlistContainer')
var dropdown = $('#dropdown')
var taskArray = [];
var timeInput = $('#timeInput')
var storage = $('#storage')
var spotifyPlaylist;

// Spotify API variables 
var client_id = "4e26ad17c8bb4367873c37ff09d37cc6";
var client_secret = "6c247c5fb58d420ca3243ca51bc0f947";

// Input bar dropdown shows up once you click the 'Add Task' button
addTaskButton.on('click', function () {
    // Checks condition - if the input bar is hidden, it shows up and replaces the 'Add Task' button
    if (form.hasClass("hidden")) {
        form.removeClass("hidden").addClass("show");
        addTaskButton.addClass("hidden").removeClass("show")

    }
})

submitButton.on('click', function () {
    var keyword = dropdown.val()
    var time = (timeInput.val())
    taskContainer.append(`<div>${keyword}</div>`)
    taskContainer.append(`<div>${time}</div>`)
    addTaskButton.removeClass("hidden").addClass("show") // Brings back the 'Add Task' button once 'keyword' variable is appended
    form.addClass("hidden").removeClass("show")
    resetForm()
    getSpotifyApi(keyword)

    var savedTasks = {
        Task: keyword,
        Time: time,
        // Playlists: spotifyPlaylist
    };
    taskArray.push(savedTasks)

    console.log(taskArray)

    localStorage.setItem("Saved Tasks", JSON.stringify(taskArray));

})

function renderSavedTasks() {
    var getItem = JSON.parse(localStorage.getItem("Saved Tasks"));
    console.log(getItem)
    if (getItem !== null) {
        for (var i = 0; i < getItem.length; i++) {
            storage.append(`<div>${getItem[i].Task}</div>`)
            storage.append(`<div>${getItem[i].Time}</div>`)
        }
    }

    console.log(getItem)
    // var retrievedTasks = JSON.parse(getItem);
    // taskContainer.textContent = getItem
}

renderSavedTasks()



// console.log(retrievedTasks)


function resetForm() {
    dropdown.val('Select');
    timeInput.val('');
}

// Runs all of the Spotify API code and passes in the parameter 'keyword'
function getSpotifyApi(keyword) {
    async function getAccessToken() {
        try {
            var response = await fetch("https://accounts.spotify.com/api/token", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: new URLSearchParams({
                    "grant_type": "client_credentials",
                    "code": "code",
                    "redirect_uri": "http://localhost:5000/callback",
                    "client_secret": client_secret,
                    "client_id": client_id,
                }),
            });

            var result = await response.json();
            // console.log("Successfully received access token");
            return result.access_token;
        } catch (error) {
            // console.log("Error getting access token:", error);
        }
    }

    async function getPlaylists(keyword, access_token) {
        try {
            var response = await fetch(`https://api.spotify.com/v1/search?q=${keyword}&type=playlist&limit=3`, {
                method: "GET",
                headers: {
                    'Authorization': 'Bearer ' + access_token,
                },
            });

            var result = await response.json();
            // console.log("Successfully searched for playlists");
            return result.playlists.items;
        } catch (error) {
            // console.log("Error getting playlists:", error);
        }
    }

    async function main() {
        var access_token = await getAccessToken();

        var playlists = await getPlaylists(keyword, access_token);

        playlistContainer.html('');

        for (var i = 0; i < playlists.length; i++) {
            var playlistLink = playlists[i].external_urls.spotify;
            var playlistImage = playlists[i].images[0].url;

            // Append each playlist to the playlistContainer
            playlistContainer.append(`<a href="${playlistLink}" target="_blank"><div><img src="${playlistImage}"></div></a>`);
        }

        // console.log(playlists);

        // var playlistLink = playlists[0].external_urls.spotify
        // var playlistImage = playlists[0].images[0].url
        // spotifyPlaylist = playlistLink
        // console.log(spotifyPlaylist)

        // console.log(playlistImage)

        // playlistContainer.append(`<a href="${playlistLink}" target="_blank"><div><img src="${playlistImage}" style="width:200px; height: 200px;"></div></a>`)
        // return spotifyPlaylist;

        return playlists.map(playlist => playlist.external_urls.spotify);

    }

    main();

}

// function saveToStorage(keyword) {
//     var savedTasks = JSON.parse(localStorage.getItem(taskArray.length)) || [];
//     Object.values(savedTasks)
//     savedTasks.push(keyword);
//     localStorage.setItem("Tasks", JSON.stringify(taskArray))
// }


//localStorage.setItem("Tasks", JSON.stringify(taskArray))
//taskArry.push({`"task":${taskName}, "time":{taskTime}, "playlist":${playlistFromAPICall}` })


// need to be able to save and update local storage with the index of the id of the time I am changing

// in save to storage function - it needs to know what index it needs to update
// each key is going to be an index, the value of each one is going to be an object with the values of the time, task name and playlist links

//which index im updating, what the key of the value im updating and what the new value is 
// so when you refresh it will look at local storage and put them in the right places

// If the dropdown value is anything other than "Select", append the changed value of dropdown and a time input
// dropdown.change(function () {
//     var keyword = dropdown.val()
//     if (dropdown.val() !== 'Select') {
//         tasks.append(`<div>${keyword}</div>`)
//         taskArray.push(keyword)
//         addTaskButton.removeClass("hidden").addClass("show") // Brings back the 'Add Task' button once 'keyword' variable is appended
//         form.addClass("hidden").removeClass("show") // Hides the input bar when the button is back 
//         getSpotifyApi(keyword)
//         dropdown.val('Select') // Reverts the value of dropdown to 'Select' 
//        // saveToStorage(keyword) // Saves the tasks to local storage
//     }
// })

// taskContainer.on('change', timeInput, function (event) {
//     event.target = timeInput
//     keyword = timeInput.length
//     console.log(taskArray.length)
//     saveToStorage(keyword)
// })