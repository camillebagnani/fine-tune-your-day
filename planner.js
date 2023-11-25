var plannerSection = $('#planner-section')
var tass = $('#tasks')
var addTaskButton = $('#add-task')
var inputBar = $('#input')

function addNewTask() {
    addTaskButton.on('click', function () {
        addTaskButton.hide()
            inputBar.append(`<label for="dropdown" id="dropdown-label">Choose a task:</label> 
    <select name="dropdown" id="dropdown"> 
        <option value="clean">Clean</option> 
        <option value="study">Study</option> 
        <option value="workout">Workout</option> 
        <option value="shop">Shop</option>
        <option value="carpool">Carpool</option>
        <option value="Cook">Cook</option>
        <option value="other">Other</option>
    </select>`)

        var dropdown = $('#dropdown')
        var dropdownLabel = $('#dropdown-label')

        dropdown.change(function () {
            dropdown.replaceWith(
                tasks.append($(dropdown).val())
            )
            dropdownLabel.remove()
            addTaskButton.show()
        })
    })
}

addNewTask()