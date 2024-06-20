// global variables
const newAssignmentBtn = document.getElementById("new-assignment-btn")
const eraseAllBtn = document.getElementById("erase-all")
const assignmentBoxClone = document.querySelector(".assignment-box.clone.hidden")
const allAssignmentsList = document.getElementById("all-assignments")
const myListName = "myAssignmentsList"

// add a new assignment when the button is clicked
function addAssignment() {
  // get input and save it into list
  const inputField = document.getElementById("new-assignment-input")
  let inputText = inputField.value
  
  // ignore empty input
  if (inputText === "") {
    return "Add a title for your assignment in the input box."
  }
  
  // create an object to add to the list
  let newAssignment = {
    name: inputText,
    tasks: []
  }

  // look for list of assignments on local storage
  assignments = findList()
  assignments.push(newAssignment)
  
  // delete the text from input field
  inputField.value = ""
  
  // save the list
  saveList(assignments)
  
  // show the new assignment on the page
  showAssignment(newAssignment)
}

// display the new assignment
function showAssignment(assignment) {
  // clone the template table
  const newTable = assignmentBoxClone.cloneNode(true)

  // apply title
  newTable.querySelector(".assignment-title")
    .textContent = assignment.name

  // append to the list and show on screen
  newTable.classList.value = "task-box"
  allAssignmentsList.appendChild(newTable)
  
  // if stored tasks, add to table
  for (let task in assignment.tasks) {
    // pass object with task to the function
    let newRow = addTaskRow(assignment.tasks[task])
    newTable.querySelector(".table-body").appendChild(newRow)
  }
}

// search local storage for saved list of assignments
function findList() {
  const savedList = localStorage.getItem(myListName)
  let myAssignmentsList
  
  // if there is no saved list create a new one
  if (savedList) {
    myAssignmentsList = JSON.parse(savedList)
  } 
  else {
    myAssignmentsList = []
  }
  
  // returns the list object
  return myAssignmentsList
}

// update list of assignments into the local storage
function saveList(updatedList) {
  // stringify the list
  const toSaveList = JSON.stringify(updatedList)
  
  // save string to local storage
  localStorage.setItem(myListName, toSaveList)
  console.log("Local Storage has been updated")
}

// delete assignment when delete button is clicked
function deleteAssignment(event) {
  // remove the assignment from the local storage saved list
  const deleteTitle = event.target.parentNode.getElementsByTagName("h2")[0].textContent
  const savedList = findList()
  let newList = savedList.filter(function (toKeep) {
    return toKeep.name !== deleteTitle
  })
  saveList(newList)

  // remove the list item from all-tasks
  const listItem = event.target.parentNode.parentNode
  listItem.remove()
}

// display the table when mouse is over the list
function untoggle(event) {
  let table = event.target.getElementsByTagName("table")[0]
  table.style.visibility = "visible"
}

// collapse the table when mouse leaves the list
function toggle(event) {
  let table = event.target.getElementsByTagName("table")[0]
  table.style.visibility = "collapse"
}

// on page load show all the existing assignments
function showSavedAssignments() {
  // if there is a saved list
  const savedList = findList()
  
  // create new list element for each item saved
  for (let assignment in savedList) {
    showAssignment(savedList[assignment])
  }
}

// add new task to the assignment table
function saveTask(event) {
  // save new task and implementation text
  const assignment = event.target.closest("li")
  const assignmentTitle = assignment.querySelector(".assignment-title")
  const newTaskRow = event.target.closest("tr")
  const taskName = newTaskRow.querySelector(".task").value
  const implementationText = newTaskRow.querySelector(".implementation").value
  
  // ignore empty task
  if (taskName === "") {
    return "Missing task name."
  }
  
  // create a task object with info
  const taskObj = {
    task: taskName,
    implementation: implementationText,
    done: false,
  }
  
  // empty input fields
  newTaskRow.querySelector(".task").value = ""
  newTaskRow.querySelector(".implementation").value = ""
  
  // find assignment in local storage
  const list = findList()
  const listIndex = findAssignmentInStorage(list, assignmentTitle)

  // add task to the local Storage
  list[listIndex].tasks.push(taskObj)
  saveList(list)

  // add the task row to the html
  let taskRow = addTaskRow(taskObj)
  assignment.querySelector(".table-body").appendChild(taskRow)
}

// remove a task from the assignment
function removeTask(event) {
  const toRemoveAssignment = event.target.closest("li").querySelector(".assignment-title")
  const toRemoveRow = event.target.closest("tr")
  const toRemoveTask = toRemoveRow.querySelector(".task").textContent

  // find assignment in local storage
  const list = findList()
  const listIndex = findAssignmentInStorage(list, toRemoveAssignment)
  
  // remove task from storage
  const thisAssignmentTasks = list[listIndex].tasks
  const taskIndex = findTask(thisAssignmentTasks, toRemoveRow)
  thisAssignmentTasks.splice(taskIndex, 1)
  
  // update the list
  saveList(thisAssignmentTasks)
  
  // remove assignment row from html
  toRemoveRow.remove()
}

// look for the correct assignment in local storage 
function findAssignmentInStorage(list, assignmentTitle) {
  // serch for correct assignment object
  for (let i = 0; i < list.length; i++) {
    if (list[i].name === assignmentTitle.textContent) {
      return i
    }
  }
  return "Assignment not found"
}

// look for the correct task within the given assignment task list
function findTask(taskList, taskName) {
  for (let i = 0; i < taskList.length; i++) {
    if (taskList[i].task === taskName) {
      return i
    }
  }
  return "Task not found"
}

// add new row with new task
function addTaskRow(taskObj) {
  // clone empty row
  const taskRowClone = document.querySelector(".task-row.clone")
  const newRow = taskRowClone.cloneNode(true)

  // add info
  newRow.querySelector(".task").textContent = taskObj.task
  newRow.querySelector(".implementation").textContent = taskObj.implementation
  newRow.querySelector(".done").querySelector(".checkbox").checked = taskObj.done

  // make visible
  newRow.classList = "task-row"
  return newRow
}

// update the local storage when task is checked
function finishedTask(event) {
  // get the task related to the checkbox
  const taskName = event.target.closest("tr").querySelector(".task").textContent
  const assignmentTitle = event.target.closest("li").querySelector(".assignment-title")
  let list = findList()
  let index = findAssignmentInStorage(list, assignmentTitle)
  let taskList = list[index].tasks
  let taskIndex = findTask(taskList, taskName)
  
  // change value of "done" property in task
  if (taskList[taskIndex].done === true) {
    taskList[taskIndex].done = false
  } else {
    taskList[taskIndex].done = true
  }
  
  saveList(list)
  console.log("Checked item")
}

// remove the data saved in the local storage
function eraseAll() {
  // if there is a list on local storage, remove it
  localStorage.removeItem(myListName)
  showSavedAssignments()
  window.alert("Local Storage has been erased")
}

// event listener for the button "Free Local Storage"
eraseAllBtn.addEventListener("click", eraseAll)

// it shows existing assignments on the page load
window.addEventListener("load", showSavedAssignments)

// reminder of local storage use
window.alert("Warning: this program will save your input on local Storage. Erase your local Storage with the provided button.")