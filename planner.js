var plannerSection = $('#planner-section')
var task = $('#tasks')
var addTaskButton = $('#add-task')
var inputBar = $('#input')

addTaskButton.on('click', function(){
    inputBar.append(`<label for="dropdown">Choose a task:</label> 
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
    dropdown.on('click',function(){
        console.log("test")
    })
})