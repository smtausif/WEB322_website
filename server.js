/********************************************************************************
*  WEB322 – Assignment 05
* 
*  I declare that this is my own work based on the rules of Seneca's
*  Academic Integrity Policy:
* 
*  https://www.senecacollege.ca/about/policies/academic-integrity-policy.html
* 
*  Name: SM Tausif Student ID: 187699236 Date: 25.11.24
*
*  Published URL: https://web-322-website.vercel.app/
*
********************************************************************************/

require('dotenv').config(); // Load environment variables
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser'); // For parsing form data
const projectData = require('./modules/projects');  

const app = express();
const PORT = 3000;

// Set up the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware to parse URL-encoded form data and serve static files
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Home route
app.get('/', (req, res) => {
    res.render('home', { page: '/' });
});

// About route
app.get('/about', (req, res) => {
    res.render('about', { page: '/about' });
});

// Projects route: Displaying projects by sector or all projects
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

// Route to render the "Add Project" form
app.get('/solutions/addProject', (req, res) => {
    projectData.getAllSectors()
        .then((sectors) => {
            res.render('addProject', { sectors: sectors, page: '/solutions/addProject' });
        })
        .catch((err) => {
            res.status(500).render('500', { message: `Error retrieving sectors: ${err.message}`, page: '' });
        });
});

app.get('/solutions/editProject/:id', (req, res) => {
    const projectId = parseInt(req.params.id);

    // Fetch the project data and sectors from the database
    Promise.all([
        projectData.getProjectById(projectId),
        projectData.getAllSectors(),
    ])
        .then(([project, sectors]) => {
            if (project) {
                res.render('editProject', { project: project, sectors: sectors, page: '' });
            } else {
                res.status(404).render('404', { message: "Project not found.", page: '' });
            }
        })
        .catch((err) => {
            res.status(500).render('500', { message: `Error retrieving project data: ${err.message}`, page: '' });
        });
});

// Route to delete a project
app.get('/solutions/deleteProject/:id', (req, res) => {
    const projectId = parseInt(req.params.id);

    projectData.deleteProject(projectId)
        .then(() => {
            res.redirect('/solutions/projects'); // Redirect to the projects list after deletion
        })
        .catch((err) => {
            res.status(500).render('500', { message: `Error deleting project: ${err.message}`, page: '' });
        });
});

//Route to Render the Edit Form
app.get('/solutions/editProject/:id', (req, res) => {
    const projectId = req.params.id;
    projectData.getProjectById(projectId)
        .then((project) => {
            projectData.getAllSectors()
                .then((sectors) => {
                    res.render('editProject', { project: project, sectors: sectors });
                })
                .catch((err) => {
                    res.render('500', { message: `Error retrieving sectors: ${err.message}` });
                });
        })
        .catch((err) => {
            res.render('500', { message: `Error retrieving project: ${err.message}` });
        });
});

// Route to handle the "Add Project" form submission
app.post('/solutions/addProject', (req, res) => {
    projectData.addProject(req.body)
        .then(() => {
            res.redirect('/solutions/projects');
        })
        .catch((err) => {
            res.status(500).render('500', { message: `Error adding project: ${err.message}`, page: '' });
        });
});

// POST route to handle Edit Project form submission
app.post('/solutions/editProject', (req, res) => {
    const projectId = parseInt(req.body.id);

    projectData.editProject(projectId, req.body)
        .then(() => {
            res.redirect('/solutions/projects');
        })
        .catch((err) => {
            res.status(500).render('500', { message: `Error updating project: ${err.message}`, page: '' });
        });
});

app.post('/solutions/editProject', (req, res) => {
    const projectId = req.body.id; // Get the project ID from the form data
    const projectData = req.body; // The rest of the form data

    // Call the editProject function from projects.js
    projectData.editProject(projectId, projectData)
        .then(() => {
            // Redirect to the projects list if successful
            res.redirect('/solutions/projects');
        })
        .catch((err) => {
            // Render the 500 error page if there was an error
            res.render('500', { message: `I'm sorry, but we have encountered the following error: ${err.message}` });
        });
});

//POST Route to Handle Form Submission
app.post('/solutions/editProject', (req, res) => {
    const projectId = req.body.id;
    const projectData = req.body;

    projectData.editProject(projectId, projectData)
        .then(() => {
            res.redirect('/solutions/projects');
        })
        .catch((err) => {
            res.render('500', { message: `Error updating project: ${err.message}` });
        });
});

// Catch-all 404 for undefined routes
app.use((req, res) => {
    res.status(404).render('404', { message: "Page not found", page: '' });
});

// Initializing project data and start the server
projectData.Initialize()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is up and running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error("Failed to initialize project data:", error);
    });

module.exports = app; // Export the app for potential testing
