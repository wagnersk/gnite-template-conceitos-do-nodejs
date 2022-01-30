const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

 const users = [];


function checksExistsUserAccount(request, response, next) {

  const {username} = request.headers;
  const checksExistsUserAccount=users.find(user=>user.username===username)


  if(!checksExistsUserAccount){
    return response.status(400).json({error:"User not found"})
  }

  request.user = checksExistsUserAccount

  return next()
}


app.post('/users', (request, response) => {
    const {name,username} = request.body

    const checkIfUserExist=users.find(user=>user.username===username)


    if(checkIfUserExist){
      return response.status(400).json({error:"User already Exists"})
    }
    
    const user = {
      id:uuidv4(),
      name,
      username,
      todos:[]
    }
    users.push(user)

    return response.status(201).send(user)

});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  const {user} = request
  
  return response.status(201).json(user.todos)


});

app.post('/todos', checksExistsUserAccount, (request, response) => {


  const {user} = request

  const {title,deadline} = request.body

  const todo = {
    id:uuidv4(),
    title,
    done:false,
    deadline:new Date(deadline),
    created_at:new Date()
  }
  
  user.todos.push(todo)

  return response.status(201).send(todo)



});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {

  const { user } = request
  const { title,deadline} = request.body;
  const {id} = request.params

  const findTodo = user.todos.find(todos=>todos.id===id)

  if(!findTodo){
    return response.status(404).json({error:"todo not found"})
  }


  findTodo.title = title;
  findTodo.deadline = deadline; 

  user.findTodo = [...user.todos,findTodo]

  return response.status(201).json(findTodo)

});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  const { user } = request
  const {id} = request.params

  const findTodo = user.todos.find(todos=>todos.id===id)

  if(!findTodo){
    return response.status(404).json({error:"Unable to find a todo"})
  }

  findTodo.done = true;
  user.findTodo = [...user.todos,findTodo]


  return response.json(findTodo)
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {

  const { user } = request
  const {id} = request.params

  const findTodo = user.todos.find(todos=>todos.id===id)


  if(!findTodo){
    return response.status(404).json({error:"User not Exist"})
  } 

  user.todos.splice(id,1)

  return response.sendStatus(204)
});

module.exports = app;