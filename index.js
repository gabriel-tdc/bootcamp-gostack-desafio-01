const express = require('express');

const server = express();

server.use(express.json());

let logCount = 0;

server.use( (req, res, next) => {
    logCount++;
    console.log("Número de requisições: " + logCount);
    next();
});

let projects = [];

server.post('/projects', (req, res) => {
    const { id, title } = req.body;
    const tasks = []

    const project = {
        id,
        title,
        tasks
    };

    projects.push(project);

    return res.json({message: projects});
});

server.get('/projects', (req, res) => {
    return res.json(projects);
});

server.use((req, res, next) => {
    const { id } = req.params;
    const project = projects.find( project => project.id === id );

    if(!project){
        res.status(400).json({message: 'Project not found'});
        return false;
    }

    next();
});

server.put('/projects/:id', (req, res) => {
    const { id } = req.params;
    const { title } = req.body;

    // var project = projects.filter(function(e) {
    //     return e.id == id;
    // });
    
    const project = projects.find( project => project.id === id );
    
    project.title = title;

    return res.json(project);
});

server.delete('/projects/:id', (req, res) => {
    const { id } = req.params;

    const index = projects.findIndex(obj => obj.id === id);
    projects = [
        ...projects.slice(0, index),
        ...projects.slice(index + 1)
    ];

    return res.json(projects);
});

server.post('/projects/:id/tasks', (req, res) => {
    const { id } = req.params;
    const { title } = req.body;
    
    const project = projects.find( project => project.id == id );
    
    project.tasks.push(title);

    return res.json({message: projects});
});

server.listen(3333);