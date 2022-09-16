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
    return response.status(404).json({error: "User not found"})
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

  return response.status(201).send();
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  const {user} = request;  

  return response.json(user.todos);
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  const {title, deadline} = request.body;
  const {username} = request;

  const todo = { 
    id: uuidv4(), // precisa ser um uuid
    title,
    done: false, 
    deadline: new Date(deadline), 
    created_at: new Date()
  }

  username.todos.push(todo);

  return response.status(201).json(todo);
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  const {user} = request;
  const {title, deadline} = request.body;

  
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

module.exports = app;