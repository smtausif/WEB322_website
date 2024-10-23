/********************************************************************************
*  WEB322 – Assignment 03
* 
*  I declare that this assignment is my own work in accordance with Seneca's
*  Academic Integrity Policy:
* 
*  https://www.senecacollege.ca/about/policies/academic-integrity-policy.html
* 
*  Name: SM Tausif Student ID: 187699236 Date: 23.10.24
*
*  Published URL: ___________________________________________________________
*
********************************************************************************/


const express = require('express');
const path = require('path');
const projectData = require('./modules/projects');  // Assuming projects.js handles project data

const app = express();
const PORT = 3000;

// Serve static content (CSS, JS, images) from the 'public' directory
app.use(express.static('public'));

// Home route serving the home.html file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'home.html'));
});

// About route serving the about.html file
app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'about.html'));
});

// Projects route - filtered by sector if query parameter exists
app.get('/solutions/projects', (req, res) => {
    const sector = req.query.sector;
    
    // If the sector query is present, filter projects by sector
    if (sector) {
        projectData.getProjectsBySector(sector)
            .then((filteredProjects) => {
                res.json(filteredProjects);  // Respond with filtered projects (JSON)
            })
            .catch((error) => {
                res.status(404).send("Error: Sector not found.");
            });
    } else {
        // If no sector query, return all projects
        projectData.getAllProjects()
            .then((projects) => {
                res.json(projects);  // Respond with all projects (JSON)
            })
            .catch((error) => {
                res.status(500).send("Error retrieving projects.");
            });
    }
});

// Project by ID route
app.get('/solutions/projects/:id', (req, res) => {
    const projectId = parseInt(req.params.id);
    
    projectData.getProjectById(projectId)
        .then((project) => {
            if (project) {
                res.json(project);  // Respond with the project that matches the ID (JSON)
            } else {
                res.status(404).send("Project not found.");
            }
        })
        .catch((error) => {
            res.status(404).send("Error: Project not found.");
        });
});

// 404 Error route for non-existent routes
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
});

// Initialize project data and start the server
projectData.Initialize()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error("Failed to initialize project data:", error);
    });
