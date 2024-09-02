// express importing
const express = require('express');
const cors = require('cors')
const { default: mongoose } = require('mongoose');
//importing mongoDB via Mangoose
const mangoose = require('mongoose')
//creating express instance (object)
const app = express()
app.use(express.json());
app.use(cors())

// to store todos and generate ids with its length
// let allTodos = [];  //to store in local sample
// connecting DB
mongoose.connect('mongodb://127.0.0.1:27017/MERN-todo').then(()=>{
    console.log(" DB Connected succesfully");
}).catch((e) =>{
    console.log('DB not Connected... Reason:',e);
    
})
//creating schema
const todoSchema = new mangoose.Schema({
    title: {
        required:true,
        type:String
    },
    description: {
        required:true,
        type:String
    }
})
const todoModel = mangoose.model('Todo', todoSchema)

// routing options to the server
app.post('/new', async (req, res)=>{
    const {title, description} = req.body;
    // const newTodo = {
    //     id: allTodos.length +1,
    //     title,
    //     description
    // }
    // allTodos.push(newTodo)
    // console.log(allTodos);
    try {
        const newTodo = new todoModel({title, description})
        await newTodo.save()
        res.status(201).json(newTodo)
    } catch (error) {
        console.log(error);
        res.status(500).json({message : error.message})
    }
})

// to get all todo activities
app.get('/new', async (req, res)=>{
    try {
        const todos = await todoModel.find();
        res.json(todos)
    } catch (error) {
        console.log(error);
        res.status(500).json({message : error.message})
    }
})

//update todo activities
app.put('/new/:id', async(req, res)=>{
    try {
        const {title, description } = req.body
        const id = req.params.id
        const updatedTodo = await todoModel.findByIdAndUpdate(id,{title, description},{new: true})
        if(!updatedTodo){
           return res.status(404).json({message: `No todo is there with ${id}`})
        }
        res.json(updatedTodo)
    } catch (error) {
        console.log(error);
        res.status(500).json({message : error.message})
    }
})

// delete a todo item
app.delete('/new/:id', async(req, res)=>{
    try {
        const id = req.params.id
        await todoModel.findByIdAndDelete(id);
        res.status(204).end()
    } catch (error) {
        console.log(error);
        res.status(500).json({message : error.message})
    }
})
//server port
const port = 3001
app.listen(port, ()=>{
    console.log(`server Started @ ${port}`);
    
})