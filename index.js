// implement your API here
const express = require('express');
const db = require('./data/db.js');

const server = express();

server.listen(4000, (req, res) => {
    console.log(`server listening on port 4000`);
});

//global middleware to parse to json
server.use(express.json());

//find users in db
server.get('/api/users', (req, res) => {
    db.find()
        .then(users => {
            res.status(200).json(users);    
        })
        .catch(err => {
            res.status(500).json({errorMessage: "The users information could not be retrieved."})   
        });
});

//find user by id
server.get('/api/users/:id', (req, res) => {
    const {id} = req.params;
    db.findById(id)
        .then(userById => {
            if(id == userById.id){
                res.status(200).json(userById)    
            } else {
                res.status(404).json({message: "The user with the specified ID does not exist."})
            }
        })
        .catch(err => {
            res.status(404).json({ 
                errorMessage: "The user information could not be retrieved.", 
                message: "The user with the specified ID does not exist." 
            })
        })
});

//add new user to db
server.post('/api/users', (req, res) => {
    const newUser = req.body;

    db.insert(newUser)
        .then(user => {
            if(!newUser.name && !newUser.bio){
                res.status(400).jsom({errorMessage: "Please provide name and bio for the user."}) 
                
                      
            } else {
                res.status(201).json({success: "created", newUser})
                 
            }    
        })
        .catch( err => {
            res.status(500).jsom({errorMessage: "There was an error while saving the user to the database"})
        });
});

//delete user from db

server.delete('/api/users/:id', (req, res) => {
    const {id} = req.params;
    db.remove(id)
        .then(deleted => {
            if(deleted){
                res.status(204).end();
            } else {
                res.status(404).json({success: false, message:'id not found'})
            }
        })
        .catch( err => {
            res.status(500).json({success:false, err})
        })
});

//modify user 
server.put('/api/users/:id', (req, res) => {
    const {id} = req.params;
    const changes = req.body;
    db.update(id, changes)
        .then(updated => {
            if(updated){
                res.status(200).json({success: true, changes})
            } else {
                res.status(404).json({ message: "The user with the specified ID does not exist." })
            }   
        })
        .catch(err => {
            res.status(500).json({errorMessage: "The user information could not be modified."})
        })
});