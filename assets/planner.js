var taskContainer = $('#task-container')
var addTaskButton = $('#add-task')
var submitButton = $('#submit')
var form = $('#form')
var dropdown = $('#dropdown')
var taskArray = [];
var timeInput = $('#timeInput')

// Spotify API variables 
var client_id = "4e26ad17c8bb4367873c37ff09d37cc6";
var client_secret = "6c247c5fb58d420ca3243ca51bc0f947";

// Close button attempt
// var closeButton = $('.planner-section')

// closeButton.click(function (event) {
//     if($(event.target).hasClass("delete")) {
//         // var currentTask;
//         var currentCloseButton = $(event.target).siblings(".appendedTasks")
//         currentCloseButton.closest(".appendedTasks").remove()

//         // if($(event.target).hasClass("delete")) {
//         //     // currentTask = $(event.target).parent().siblings(".appendedTasks").remove()
//         //     currentCloseButton = $(event.target).siblings(".appendedTasks").remove()
//         //     console.log(currentCloseButton)
//         // }
//     }
// })

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
    for (var i = 0; i < localStorage.length; i++) {
        var saved = JSON.parse(localStorage.getItem(i));
        // If there is local storage, it will grab local storage and append it the same way as the submitButton function
        if (localStorage !== null) {
            taskContainer.append(`<button class="delete"></button>
            <div class="appendedTasks">
            <div>${(saved.Time)}</div>
            <div>${(saved.Task)}</div> 
            <div id="playlistRow">
            <a href="${saved.PlaylistLink.Playlist1}" target="_blank"><div><img class="playlistImage" src="${saved.PlaylistImage.Image1}"}></div></a>
            <a href="${saved.PlaylistLink.Playlist2}" target="_blank"><div><img class="playlistImage" src="${saved.PlaylistImage.Image2}"></div></a>
            <a href="${saved.PlaylistLink.Playlist3}" target="_blank"><div><img class="playlistImage" src="${saved.PlaylistImage.Image3}"></div></a>
            </div>
            </div>`)

            // The savedTasks array grabs the property values from the saved local storage if it exists
            var savedTasks = {
                Task: saved.Task,
                Time: saved.Time,
                PlaylistLink: {
                    Playlist1: saved.PlaylistLink.Playlist1,
                    Playlist2: saved.PlaylistLink.Playlist2,
                    Playlist3: saved.PlaylistLink.Playlist3,
                },
                PlaylistImage: {
                    Image1: saved.PlaylistImage.Image1,
                    Image2: saved.PlaylistImage.Image2,
                    Image3: saved.PlaylistImage.Image3
                }
            };

            taskArray.push(savedTasks)
        }
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

        // Appends a div that includes the user's selected time, task and playlists that were chosen by the keyword from the Spotify API call
        taskContainer.append(`<button class="delete">X</button>
        <div class="appendedTasks">
        <div>${time}</div>
        <div>${keyword}</div> 
            <div id="playlistRow">
            <a href="${playlist.playlistLinkArray[0]}" target="_blank"><div><img class="playlistImage" src="${playlist.playlistImageArray[0]}"}></div></a>
            <a href="${playlist.playlistLinkArray[1]}" target="_blank"><div><img class="playlistImage" src="${playlist.playlistImageArray[1]}"></div></a>
            <a href="${playlist.playlistLinkArray[2]}" target="_blank"><div><img class="playlistImage" src="${playlist.playlistImageArray[2]}"></div></a>
            </div>
            </div>`);

        // Create an object of saved tasks to be pushed into taskArray, which we use to set local storage
        var savedTasks = {
            Task: keyword,
            Time: time,
            PlaylistLink: {
                Playlist1: playlist.playlistLinkArray[0],
                Playlist2: playlist.playlistLinkArray[1],
                Playlist3: playlist.playlistLinkArray[2]
            },
            PlaylistImage: {
                Image1: playlist.playlistImageArray[0],
                Image2: playlist.playlistImageArray[1],
                Image3: playlist.playlistImageArray[2]
            },
        };

        taskArray.push(savedTasks)
        // Set local storage with the key as the index of the task array, and the value of the taskArray at index
        for (var i = 0; i < taskArray.length; i++) {
            localStorage.setItem(i, JSON.stringify(taskArray[i]));
        }
    }
})

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