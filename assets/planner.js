var taskContainer = $('#task-container')
var addTaskButton = $('#add-task')
var submitButton = $('#submit')
var form = $('#form')
var dropdown = $('#dropdown')
// var taskArray = [];
var timeInput = $('#timeInput')

// Spotify API variables 
var client_id = "4e26ad17c8bb4367873c37ff09d37cc6";
var client_secret = "6c247c5fb58d420ca3243ca51bc0f947";

// Form with task dropdown and time shows up once you click the 'Add Task' button
addTaskButton.on('click', function () {
    // Checks condition - if the input bar is hidden, it shows up by replacing the 'Add Task' button
    if (form.hasClass("hidden")) {
        form.removeClass("hidden").addClass("show");
        addTaskButton.addClass("hidden").removeClass("show")

    }
})

//Checks for local storage on load
window.onload = function () {
    loadSavedItems()
}

function loadSavedItems() {
    taskContainer.empty()
    var savedTasks = JSON.parse(localStorage.getItem("savedTasks")) || []
    for (var i = 0; i < savedTasks.length; i++) {
        var saved = savedTasks[i];
        // If there is local storage, it will grab local storage and append it the same way as the submitButton function
        createCard(saved.time, saved.keyword, saved.playlist, i)
    }
}
// Uses an async function to wait for the return of the promise from the Spotify API, then it can append the values from the Spotify API
submitButton.on('click', async function () {
    var keyword = dropdown.val()
    var time = timeInput.val()

    if (dropdown.val() !== 'Select') {
        addTaskButton.removeClass("hidden").addClass("show") // Brings back the 'Add Task' button once 'keyword' variable is appended
        form.addClass("hidden").removeClass("show")
        resetForm()
        var playlist = await getSpotifyApi(keyword)



        // Create an object of saved tasks to be pushed into taskArray, which we use to set local storage
        var savedTask = {
            keyword: keyword,
            time: time,
            playlist: playlist
        };


        var savedTasks = JSON.parse(localStorage.getItem("savedTasks")) || []

        savedTasks.push(savedTask)

        localStorage.setItem("savedTasks", JSON.stringify(savedTasks))

        loadSavedItems()
    }
})

function removeItem(event) {
    if ($(event.target).hasClass("delete")) {
        $(event.target).parent().remove()
        // console.dir(event.target);
        var savedTasks = JSON.parse(localStorage.getItem("savedTasks")) || []

        var filteredTasks = savedTasks.filter((task, index) => {
            return index != event.target.dataset.key
        })

        localStorage.setItem("savedTasks", JSON.stringify(filteredTasks))
    }
}

function createCard(time, keyword, playlist, index) {
    // Appends a div that includes the user's selected time, task and playlists that were chosen by the keyword from the Spotify API call
    taskContainer.append(`<div class="eachTask">
    <button data-key=${index} class="delete" id="delete-${index}"></button>
    <div class="appendedTasks">
    <div>${time}</div>
    <div>${keyword}</div> 
        <div id="playlistRow">
        <a href="${playlist.playlistLinkArray[0]}" target="_blank"><div><img class="playlistImage" src="${playlist.playlistImageArray[0]}"}></div></a>
        <a href="${playlist.playlistLinkArray[1]}" target="_blank"><div><img class="playlistImage" src="${playlist.playlistImageArray[1]}"></div></a>
        <a href="${playlist.playlistLinkArray[2]}" target="_blank"><div><img class="playlistImage" src="${playlist.playlistImageArray[2]}"></div></a>
        </div>
        </div>
        </div>`);
    var closeButton = $('#delete-' + index)

    closeButton.on('click', removeItem)
}

// Resets the task and time inputs in the form
function resetForm() {
    dropdown.val('Select');
    timeInput.val('');
}

// Runs all of the Spotify API code and passes in the parameter 'keyword'
async function getSpotifyApi(keyword) {
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

    var access_token = await getAccessToken();

    var playlists = await getPlaylists(keyword, access_token);

    // Create empty arrays so that we can return them at the end of the function
    var playlistLinkArray = [];
    var playlistImageArray = [];

    for (var i = 0; i < playlists.length; i++) {
        var playlistLink = playlists[i].external_urls.spotify;
        var playlistImage = playlists[i].images[0].url;

        // Push the values that the Spotify API call grabs to the playlistLinkArray and playlistImageArray so there will be values when we return
        playlistLinkArray.push(playlistLink);
        playlistImageArray.push(playlistImage);
    }

    return {
        playlistLinkArray: playlistLinkArray,
        playlistImageArray: playlistImageArray
    };
}