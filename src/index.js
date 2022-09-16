const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  const {username} = request.header;

  const user = users.find(user => user.username === username);

  if(!user) {
    return response.status(404).json({error: "User not found"});
  }

  request.user = user;
  return next();  
}

app.post('/users', (request, response) => {
  const {name, username} = request.body;

  const confirmIfUserExist = users.find(user => user.username === username);

  if(confirmIfUserExist) {
    return response.status(400).json({error: "User already exist"})
  }

  const user = { 
    id: uuidv4(), 
    name, 
    username, 
    todos: []
  }

  users.push(user);

  return response.status(201).json(users);
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  const {username} = request;

  return response.json(username.todos);
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  const {title, deadline} = request.body;
  const {username} = request;


  const todo = { 
    id: uuidv4(),
    title,
    done: false, 
    deadline: new Date(deadline), 
    created_at: new Date()
  }

  username.todos.push(todo);

  return response.status(201).json(todo);
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  const {username} = request.header;
  const {title, deadline} = request.body;
  const {id} = request.params;

  const confirmIfTodoExist = username.todos.find(todo => todo.id === id);

  if(!confirmIfTodoExist) {
    return response.status(404).json({error: "Todo not found"})
  }

  confirmIfTodoExist.title = title;
  confirmIfTodoExist.deadline = new Date(deadline);

  return response.json(confirmIfTodoExist);
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  const {username} = request;
  const {id} = request.params;

  const todo = username.todos.find(todo => todo.id === id);

  if(!todo) {
    return response.status(404).json({error: "Todo not found"});
  }

  todo.done = true;

  return response.json(todo);
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  const {username} = request;
  const {id} = request.params;

  const confirmIfDeleteThisTodo = username.todos.findIndex(todo => todo.id === id);

  if(confirmIfDeleteThisTodo === -1) {
    return response.status(404).json({error: "Todo not found"})
  }

  username.todos.splice(confirmIfDeleteThisTodo, 1);

  return response.status(204).json();
}); 

module.exports = app;