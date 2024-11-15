/********************************************************************************
*  WEB322 – Assignment 02
* 
*  I declare that this assignment is my own work in accordance with Seneca's
*  Academic Integrity Policy:
* 
*  https://www.senecapolytechnic.ca/about/policies/academic-integrity-policy.html
* 
*  Name: SM Tausif. Student ID: 187699236. Date: 05.10.24
*
********************************************************************************/

// these comments are for my-self so that i can track and understand when i check it again
// Load the JSON data from the given files.
// projectData contains information about various projects.
// sectorData contains information about sectors related to the projects.
const projectData = require("../data/projectData");
const sectorData = require("../data/sectorData");

// Initialize an empty array to hold the processed project objects.
let projects = [];

/*
Initialize function:
This function processes the projectData array.
For each project, it finds the corresponding sector name from the sectorData array
by matching the project's sector_id with the sector's id.
It then adds the sector name as a new property to each project and pushes it to the projects array.
The function returns a Promise that resolves once the operation is complete.
*/
function Initialize() {
    return new Promise((resolve, reject) => {
        try {
            // Loop through each project object in projectData
            projectData.forEach(project => {
                // Find the matching sector from sectorData using the sector_id
                const sector = sectorData.find(sectorObj => sectorObj.id === project.sector_id);
                
                // Create a new project object with an additional 'sector' property
                let newProject = {
                    ...project, // Copy all existing properties of the project
                    sector: sector ? sector.sector_name : "Unknown" // Add sector name or "Unknown" if not found
                };
                
                // Push the updated project object to the projects array
                projects.push(newProject);
            });
            resolve();  // Successfully completed processing, resolve the Promise with no data
        } catch (error) {
            reject("Error initializing projects");  // Handle any errors and reject the Promise with a message
        }
    });
}

/*
getAllProjects function:
This function returns the entire projects array.
It returns a Promise that resolves with the projects array.
If there are no projects, it rejects the Promise with an appropriate error message.
*/
function getAllProjects() {
    return new Promise((resolve, reject) => {
        if (projects.length > 0) {
            resolve(projects);  // Resolve the Promise with the projects array
        } else {
            reject("No projects found");  // Reject the Promise if no projects are available
        }
    });
}

/*
getProjectById function:
This function takes a projectId as a parameter and searches for a project with that ID.
It returns a Promise that resolves with the found project object.
If no project is found with the given ID, it rejects the Promise with an appropriate message.
*/
function getProjectById(projectId) {
    return new Promise((resolve, reject) => {
        // Find the project that matches the given projectId
        const project = projects.find(proj => proj.id === projectId);
        if (project) {
            resolve(project);  // Resolve the Promise with the found project
        } else {
            reject(`Unable to find project with id: ${projectId}`);  // Reject if no project is found
        }
    });
}

/*
getProjectsBySector function:
This function takes a sector string as a parameter and searches for projects whose sector matches the string.
The search is case-insensitive and checks if the sector string is part of the project's sector.
It returns a Promise that resolves with an array of projects that match the sector.
If no projects are found for the given sector, it rejects the Promise with an appropriate message.
*/
function getProjectsBySector(sector) {
    return new Promise((resolve, reject) => {
        // Filter the projects array to find projects where the sector contains the given string (case-insensitive)
        const filteredProjects = projects.filter(proj => 
            proj.sector.toLowerCase().includes(sector.toLowerCase())
        );
        if (filteredProjects.length > 0) {
            resolve(filteredProjects);  // Resolve the Promise with the filtered array of projects
        } else {
            reject(`Unable to find projects in sector: ${sector}`);  // Reject if no projects match the sector
        }
    });
}

// Exporting all the functions so they can be used in other parts of the program.
// This makes the functions available for other modules to call them.
module.exports = {
    Initialize,
    getAllProjects,
    getProjectById,
    getProjectsBySector
};
