var plannerSection = $('#planner-section')
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

// Input bar dropdown shows up once you click the 'Add Task' button
addTaskButton.on('click', function () {
    // Checks condition - if the input bar is hidden, it shows up and replaces the 'Add Task' button
    if (form.hasClass("hidden")) {
        form.removeClass("hidden").addClass("show");
        addTaskButton.addClass("hidden").removeClass("show")

    }
})

window.onload = function () {
    for (var i = 0; i < localStorage.length; i++) {
        var saved = JSON.parse(localStorage.getItem(i));
        
        if (localStorage !== null) {
            taskContainer.append(`<div class="appendedTasks">
            <div>${(saved.Time)}</div>
            <div>${(saved.Task)}</div> 
            <div id="playlistRow">
            <a href="${saved.PlaylistLink.Playlist1}" target="_blank"><div><img class="playlistImage" src="${saved.PlaylistImage.Image1}"}></div></a>
            <a href="${saved.PlaylistLink.Playlist2}" target="_blank"><div><img class="playlistImage" src="${saved.PlaylistImage.Image2}"></div></a>
            <a href="${saved.PlaylistLink.Playlist3}" target="_blank"><div><img class="playlistImage" src="${saved.PlaylistImage.Image3}"></div></a>
            </div>
            </div>`)
        
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

submitButton.on('click', async function () {
    var keyword = dropdown.val()
    var time = timeInput.val()
    if (dropdown.val() !== 'Select') {
        // taskContainer.append(`<div>${keyword} ${time}</div>`)
        // taskContainer.append(`<div>${time}</div>`)
        addTaskButton.removeClass("hidden").addClass("show") // Brings back the 'Add Task' button once 'keyword' variable is appended
        form.addClass("hidden").removeClass("show")
        resetForm()
        var playlist = await getSpotifyApi(keyword)

        taskContainer.append(`<div class="appendedTasks">
        <div>${time}</div>
        <div>${keyword}</div> 
            <div id="playlistRow">
            <a href="${playlist.playlistLinkArray[0]}" target="_blank"><div><img class="playlistImage" src="${playlist.playlistImageArray[0]}"}></div></a>
            <a href="${playlist.playlistLinkArray[1]}" target="_blank"><div><img class="playlistImage" src="${playlist.playlistImageArray[1]}"></div></a>
            <a href="${playlist.playlistLinkArray[2]}" target="_blank"><div><img class="playlistImage" src="${playlist.playlistImageArray[2]}"></div></a>
            </div>
            </div>`)

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
        console.log(savedTasks)
        

        for (var i = 0; i < taskArray.length; i++) {
            localStorage.setItem(i, JSON.stringify(taskArray[i]));
        }
    }
})

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


    // async function main() {
    var access_token = await getAccessToken();

    var playlists = await getPlaylists(keyword, access_token);

    // playlistContainer.html('');

    var playlistLinkArray = [];
    var playlistImageArray = [];

    for (var i = 0; i < playlists.length; i++) {
        var playlistLink = playlists[i].external_urls.spotify;
        var playlistImage = playlists[i].images[0].url;
        
        playlistLinkArray.push(playlistLink);
        playlistImageArray.push(playlistImage);

        // Append each playlist to the playlistContainer
        // taskContainer.append(`<a href="${playlistLink}" target="_blank"><div><img src="${playlistImage}"></div></a>`);
    }
    
    return {
        playlistLinkArray: playlistLinkArray,
        playlistImageArray: playlistImageArray
      };
    // return {playlistLink, playlistImage};
}


   




















// }

    // main();

    


    


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

    // function renderSavedTasks(){
//     var getItem = JSON.parse(localStorage.getItem("Saved Tasks"));
//     console.log(getItem)
//     if (getItem !== null) {
//         for(var i = 0; i < getItem.length; i++) {
//         storage.append(`<div>${getItem[i].Task}</div>`)
//         storage.append(`<div>${getItem[i].Time}</div>`)
//     }
//     }

//     console.log(getItem)
//     // var retrievedTasks = JSON.parse(getItem);
//     // taskContainer.textContent = getItem
// }

// renderSavedTasks()



// console.log(retrievedTasks)