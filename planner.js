var plannerSection = $('#planner-section')
var tasks = $('#tasks')
var addTaskButton = $('#add-task')
var inputBar = $('#input')

var client_id = "4e26ad17c8bb4367873c37ff09d37cc6";
var client_secret = "6c247c5fb58d420ca3243ca51bc0f947";



function addNewTask() {
    addTaskButton.on('click', function () {
        addTaskButton.hide()
        inputBar.append(`<label for="dropdown" id="dropdown-label">Choose a task:</label> 
    <select name="dropdown" id="dropdown">
        <option value="Select">Select</option>
        <option value="Clean">Clean</option> 
        <option value="Study">Study</option> 
        <option value="Workout">Workout</option> 
        <option value="Shop">Shop</option>
        <option value="Carpool">Carpool</option>
        <option value="Cook">Cook</option>
        <option value="Other">Other</option>
    </select>`)

        var dropdown = $('#dropdown')
        var dropdownLabel = $('#dropdown-label')

        dropdown.change(function () {
            dropdown.replaceWith(
                tasks.append(`<div>${(dropdown).val()}</div>`)
            )
            dropdownLabel.remove()
            addTaskButton.show()
            var keyword = dropdown.val();
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
                    console.log("Successfully received access token");
                    return result.access_token;
                } catch (error) {
                    console.log("Error getting access token:", error);
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
                    console.log("Successfully searched for playlists");
                    return result.playlists.items;
                } catch (error) {
                    console.log("Error getting playlists:", error);
                }
            }

            async function displayPlaylists() {
                var access_token = await getAccessToken();
                var playlists = await getPlaylists(keyword, access_token);
                var playlistContainer = document.getElementById("playlistContainer");

                playlistContainer.innerHTML = "";

                playlists.forEach(function (playlist) {
                    var link = document.createElement("a");
                    link.href = playlist.external_urls.spotify;
                    link.textContent = playlist.name;
                    link.target = "_blank";

                    var listItem = document.createElement("li");
                    listItem.appendChild(link);

                    playlistContainer.appendChild(listItem);
                })

            }

            async function main() {
                var access_token = await getAccessToken();

                var playlists = await getPlaylists(keyword, access_token);

                console.log(playlists);
            }

            main();
            displayPlaylists();
        })
    })
}

addNewTask()

