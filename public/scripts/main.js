//Selectors
const todoInput = document.querySelector(".todo-input");
const todoButton = document.querySelector(".todo-button");
const todoList = document.querySelector(".todo-list");
const filterOption = document.querySelector(".filter-todo")
const ClearCache = document.querySelector(".todo-clearCache")
//Event Listeners
todoButton.addEventListener('click', addTodo)
ClearCache.addEventListener('click', clearCache)
todoList.addEventListener('click', deleteCheck)
filterOption.addEventListener('click', filterTodo)
// Functions
fetch('http://localhost:8081/toDo')  
  .then((response) => response.json())  
  .then((arr) => {
      console.log(arr);
      drawList(arr);
  });  

// var temp = new Object();

function completeTodo(id) {
    id = JSON.parse(decodeURIComponent(id))
    id.done = "true"
    console.log(id)
    postData('http://localhost:8081/toDotest', id)
  .then(data => {
      console.log(data)
    fetch('http://localhost:8081/toDo')  
    .then((response) => response.json())  
    .then((arr) => {console.log(arr); drawList(arr)});  
  });
}

function deleteTodo(id){
    id = JSON.parse(decodeURIComponent(id))
    id.done = "true"
    console.log(id)
    postData('http://localhost:8081/toDoDel', id)
  .then(data => {
      console.log(data)
    fetch('http://localhost:8081/toDoDel')  
    .then((response) => response.json())  
    .then((arr) => {console.log(arr); drawList(arr)});  
  });
}

function drawList(data) {
    todoList.innerHTML=''
    data.forEach(el=>{
        var todoDiv = document.createElement('div')
        todoDiv.classList.add('todo');
        if(el.done == "true")
        todoDiv.classList.add("completed")
    
        //Create Li
        const newTodo = document.createElement('li')
        newTodo.innerText = el.name;
        newTodo.id = el._id;
        newTodo.classList.add("todo-item");
        todoDiv.appendChild(newTodo);
        var btn=`<button class="complete-btn" onclick ="completeTodo('${encodeURIComponent(JSON.stringify(el))}')"><i class="fas fa-check"></i></button>`
        todoDiv.innerHTML+=btn

        todoDiv.innerHTM +=btn
           
        //Check Mark Button
        var trashButton = `<button class="trash-btn" onclick ="deleteTodo('${encodeURIComponent(JSON.stringify(el))}')"><i class="fas fa-trash"></i></button>`
        todoDiv.innerHTML+=trashButton
        //APPEND TO LIST
        todoList.appendChild(todoDiv)
       
      })
}
function clearCache(event){
    console.log(event)
    postData('http://localhost:8081/toDoClearAll', {})
    .then(data => {
        console.log(data)
      fetch('http://localhost:8081/toDoClearAll')  
      .then((response) => response.json())  
      .then((arr) => {console.log(arr);drawList(arr)});  
    });

}

function addTodo(event) {
    event.preventDefault();
console.log(todoInput.value)

    postData('http://localhost:8081/toDo', { name : todoInput.value, done: "false", delete:"false"})
  .then(data => {
      console.log(data)
    fetch('http://localhost:8081/toDo')  
    .then((response) => response.json())  
    .then((arr) => {console.log(arr);drawList(arr)});  
  });
  todoInput.value = ""
}

function deleteCheck(event) {
    const item = event.target;
    //Delete todo
    if (item.classList[0] === "trash-btn") {
        const todo = item.parentElement;
        //Animation
        todo.classList.add("fall")
        todo.addEventListener('transitionend', function () {
            todo.remove();
        })

    }
    //CHECK MARK
  
}

function filterTodo(event) {
    const todos = todoList.childNodes;
    todos.forEach(function (todo) {
        switch (event.target.value) {
            case "all":
                todo.style.display = 'flex';
                break;
            case "completed":
                if (todo.classList.contains('completed')) {
                    todo.style.display = 'flex';
                }
                else {
                    todo.style.display = "none"
                }
                break;
            case "uncompleted":
                if (!todo.classList.contains('completed')) {
                    todo.style.display = 'flex';
                }
                else {
                    todo.style.display = "none"
                }
                break;
        }
    });
}




async function postData(url = '', data = {}) {
    console.log(data)

    // Default options are marked with *
    const response = await fetch(url, {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json'
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: 'follow', // manual, *follow, error
      referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: JSON.stringify(data) // body data type must match "Content-Type" header
    });
    return response.json(); // parses JSON response into native JavaScript objects
  }