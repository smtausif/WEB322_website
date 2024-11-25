/********************************************************************************
*  WEB322 – Assignment 05
* 
*  I declare that this assignment is my own work in accordance with Seneca's
*  Academic Integrity Policy:
* 
*  https://www.senecapolytechnic.ca/about/policies/academic-integrity-policy.html
* 
*  Name: SM Tausif. Student ID: 187699236. Date: 25.11.24
*
********************************************************************************/

const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL || null, // Use DATABASE_URL
    ssl: {
        rejectUnauthorized: false, // Ensures SSL is used
    },
    port: process.env.PGPORT || 5432, 
});

// Example: Initialize function to test database connection
function Initialize() {
    return new Promise((resolve, reject) => {
        pool.query('SELECT 1 + 1 AS result')
            .then(() => resolve("Database connected successfully"))
            .catch((err) => reject(`Error initializing database: ${err.message}`));
    });
}

function getAllProjects() {
    const query = `
        SELECT 
            projects.id, 
            projects.title, 
            projects.feature_img_url, 
            projects.summary_short, 
            projects.intro_short, 
            projects.impact, 
            projects.original_source_url, 
            sectors.sector_name AS sector
        FROM projects
        JOIN sectors ON projects.sector_id = sectors.id
    `;

    return pool.query(query)
        .then((res) => res.rows)
        .catch((err) => {
            console.error('Error fetching all projects:', err.message);
            throw new Error("Error retrieving all projects");
        });
}


function getProjectById(projectId) {
    return pool.query('SELECT * FROM projects WHERE id = $1', [projectId])
        .then((res) => {
            if (res.rows.length > 0) {
                return res.rows[0];
            } else {
                throw new Error(`Unable to find project with id: ${projectId}`);
            }
        })
        .catch((err) => {
            console.error('Error fetching project by ID:', err.message);
            throw new Error(`Error retrieving project with id: ${projectId}`);
        });
}

function getProjectsBySector(sectorName) {
    const query = `
        SELECT projects.*, sectors.sector_name AS sector 
        FROM projects 
        INNER JOIN sectors ON projects.sector_id = sectors.id
        WHERE LOWER(sectors.sector_name) = LOWER($1)
    `;

    return pool.query(query, [sectorName])
        .then((res) => {
            if (res.rows.length > 0) {
                return res.rows;
            } else {
                throw new Error(`No projects found in sector: ${sectorName}`);
            }
        })
        .catch((err) => {
            console.error('Error fetching projects by sector:', err.message);
            throw new Error(`Error retrieving projects in sector: ${sectorName}`);
        });
}


function addProject(projectData) {
    const query = `
        INSERT INTO projects (title, feature_img_url, sector_id, intro_short, summary_short, impact, original_source_url)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
    `;
    const values = [
        projectData.title,
        projectData.feature_img_url,
        projectData.sector_id,
        projectData.intro_short,
        projectData.summary_short,
        projectData.impact,
        projectData.original_source_url,
    ];

    return pool.query(query, values)
        .then(() => "Project added successfully")
        .catch((err) => {
            console.error('Error adding project:', err.message);
            throw new Error(err.message);
        });
}

function getAllSectors() {
    return pool.query('SELECT * FROM sectors')
        .then((res) => res.rows)
        .catch((err) => {
            console.error('Error fetching sectors:', err.message);
            throw new Error("Error retrieving sectors");
        });
}

function editProject(id, projectData) {
    const query = `
        UPDATE projects
        SET 
            title = $1, 
            feature_img_url = $2, 
            sector_id = $3, 
            intro_short = $4, 
            summary_short = $5, 
            impact = $6, 
            original_source_url = $7
        WHERE id = $8
    `;
    const values = [
        projectData.title,
        projectData.feature_img_url,
        projectData.sector_id,
        projectData.intro_short,
        projectData.summary_short,
        projectData.impact,
        projectData.original_source_url,
        id
    ];

    return pool.query(query, values)
        .then(() => "Project updated successfully")
        .catch((err) => {
            console.error('Error updating project:', err.message);
            throw new Error(err.message);
        });
}

function deleteProject(id) {
    const query = `DELETE FROM projects WHERE id = $1`;

    return pool.query(query, [id])
        .then(() => "Project deleted successfully")
        .catch((err) => {
            console.error('Error deleting project:', err.message);
            throw new Error(err.message);
        });
}


module.exports = {
    Initialize,
    getAllProjects,
    getProjectById,
    getProjectsBySector,
    addProject,
    getAllSectors,
    editProject,
    deleteProject
};