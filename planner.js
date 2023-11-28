var plannerSection = $('#planner-section')
var tass = $('#tasks')
var addTaskButton = $('#add-task')
var inputBar = $('#input')

function addNewTask() {
    addTaskButton.on('click', function () {
        addTaskButton.hide()
            inputBar.append(`<label for="dropdown" id="dropdown-label">Choose a task:</label> 
    <select name="dropdown" id="dropdown"> 
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
                tasks.append($(dropdown).val())
            )
            dropdownLabel.remove()
            addTaskButton.show()
        })
    })
}

addNewTask()