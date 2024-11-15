/********************************************************************************
*  WEB322 – Assignment 03
* 
*  I declare that this is my own work based on the rules of Seneca's
*  Academic Integrity Policy:
* 
*  https://www.senecacollege.ca/about/policies/academic-integrity-policy.html
* 
*  Name: SM Tausif Student ID: 187699236 Date: 23.10.24
*
*  Published URL: https://web-322-website.vercel.app/
*
********************************************************************************/

const express = require('express');
const path = require('path');
const projectData = require('./modules/projects');  // Assumes this handles project-related data

const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// Home route
app.get('/', (req, res) => {
    res.render('home', { page: '/' });
});

// About route
app.get('/about', (req, res) => {
    res.render('about', { page: '/about' });
});

// Projects route: Display projects by sector or all projects
app.get('/solutions/projects', (req, res) => {
    const sector = req.query.sector;

    if (sector) {
        projectData.getProjectsBySector(sector)
            .then((filteredProjects) => {
                res.render('projects', { projects: filteredProjects, page: '/solutions/projects' });
            })
            .catch((error) => {
                res.status(404).render('404', { message: "Sector not found.", page: '' });
            });
    } else {
        projectData.getAllProjects()
            .then((projects) => {
                res.render('projects', { projects: projects, page: '/solutions/projects' });
            })
            .catch((error) => {
                res.status(500).render('404', { message: "Error retrieving projects.", page: '' });
            });
    }
});

// Individual project route
app.get('/solutions/projects/:id', (req, res) => {
    const projectId = parseInt(req.params.id);

    projectData.getProjectById(projectId)
        .then((project) => {
            if (project) {
                res.render('project', { project: project, page: '' });
            } else {
                res.status(404).render('404', { message: "Project not found.", page: '' });
            }
        })
        .catch((error) => {
            res.status(404).render('404', { message: "Error: Project not found.", page: '' });
        });
});

// Catch-all 404 for undefined routes
app.use((req, res) => {
    res.status(404).render('404', { message: "Page not found", page: '' });
});

// Initialize project data and start the server
projectData.Initialize()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is up and running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error("Failed to initialize project data:", error);
    });
