// const inquirer = require('inquirer');
// const consoleTable = require('console.table');
// const mysql2 = require('mysql2');

import inquirer from 'inquirer'
import consoleTable from 'console.table'
import mysql2 from 'mysql2'

const db = mysql2.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'MasohaNine$68',
    database: 'hw12',
})
console.log('Connected to db')

function promptAction() {
    inquirer.prompt([
        {
            type: "list",
            name: "action",
            message: "Choose your action:",
            choices: [
                "View Departments",
                "View Roles",
                "View Employees",
                "Add Department",
                "Add Role",
                "Add Employee",
                "Update Role", // Not in requirement, just to test
                "Update Employee", 
            ]
        }
    ]).then(({ action }) => {
        switch(action) {
            case "View Departments":
                displayDepartments();
                break;
            case "View Roles":
                displayRoles();
                break;
            case "View Employees":
                displayEmployees();
                break;
            case "Add Department":
                addingDepartment();
                break;
            case "Add Role":
                addingRoles();
                break;
            case "Add Employee":
                addingEmployee();
                break;
            case "Update Role":
                updateRole();
                break
            case "Update Employee":
                updateEmployee();
                break
            default:
                console.log("SOMETHING WRONG")
        }
    })
}

// Query and display data in Departments table.
async function displayDepartments() {
    const [result] = await db.promise().query(
        `SELECT * FROM Departments` 
    );

    console.table(result)

    promptAction()
}

// Query and display data in Departments table.
async function displayRoles() {
    const [result] = await db.promise().query(
        `SELECT
            Roles.id AS "Role ID",
            job_title AS "Job Title",
            salary AS "Salary",
            name AS "Department Name"
        FROM Roles
        JOIN Departments ON department_id = Departments.id` 
    );

    console.table(result)

    promptAction()
}

async function displayEmployees() {
    const [result] = await db.promise().query(
        `SELECT
           * 
        FROM Employees
        JOIN Roles ON role_id = Roles.id
        JOIN Departments ON department_id = Departments.id`
    );

    console.table(result)

    promptAction()
}

function addingDepartment() {
    // Future function
    inquirer.prompt([
        {
            type: 'input',
            name: 'departmentName', 
            message: 'Enter department name: '
        },
    ]).then(({departmentName}) => {
        db.query(
            `INSERT INTO Departments (name)
            VALUES ("${departmentName}")`, 
            (err, result) => {
                if (err) {
                    console.log(err)
                }
            }
        );
        promptAction()
    })
}

async function addingRoles() {
    // Get all departments
    const [departments, _] = await db.promise().query(`SELECT * FROM Departments`)  

    const departmentNames = [] // Used to display choices
    const departmentIdLookupObject = {} // Used to know which department id is chosen to be added
    for (const {id, name} of departments) {
        departmentNames.push(name)
        departmentIdLookupObject[name] = id
    }

    const { jobTitle, salary, departmentName } = await inquirer.prompt([
        {
            type: 'input',
            name: 'jobTitle', 
            message: `Enter title:`
        },
        {
            type: 'input',
            name: 'salary', 
            message: `Enter salary:`
        },
        {
            type: 'list',
            name: 'departmentName',
            message: 'Pick Department: ',
            choices: departmentNames,
        }
    ])

    // Get department id from the chosen department name
    const departmentId = departmentIdLookupObject[departmentName]
    
    // Insert to table using db.query
    await db.promise().query(`
        INSERT INTO Roles (job_title, salary, department_id)
        VALUES ("${jobTitle}", ${salary}, ${departmentId})
    `)

    promptAction()
}

async function updateRole() {
    // Get all roles to display, so user can pick what role to update
    const [roles] = await db.promise().query(`SELECT * FROM Roles`)  

    const roleTitles = [] 
    const roleIdLookup = {}
    for (const {id, job_title} of roles) {
        roleTitles.push(job_title)
        roleIdLookup[job_title] = id
    }

    const { roleTitle } = await inquirer.prompt([
        {
            type: 'list',
            name: 'roleTitle',
            message: 'Pick a role to update: ',
            choices: roleTitles,
        }
    ])  

    // Get the role id that represents which role to be updated
    const roleId = roleIdLookup[roleTitle] 

    // Get all departments to display, so user can pick a new department for this role
    const [departments] = await db.promise().query(`SELECT * FROM Departments`)  

    const departmentNames = [] 
    const departmentIdLookupObject = {}
    for (const {id, name} of departments) {
        departmentNames.push(name)
        departmentIdLookupObject[name] = id
    }

    const { departmentName } = await inquirer.prompt([
        {
            type: 'list',
            name: 'departmentName',
            message: 'Pick A New Department: ',
            choices: departmentNames,
        }
    ]) 

    // Get the new department id selected by user for this role
    const departmentId = departmentIdLookupObject[departmentName]

    // Update the role with the new department id using db.query
    await db.promise().query(`
        UPDATE Roles 
        SET department_id = ${departmentId} 
        WHERE id = ${roleId}
    `)

    promptAction()
}

async function addingEmployee() {
    // Get all roles to display, so user can pick what role to update
    const [roles] = await db.promise().query(`SELECT * FROM Roles`) 

    const roleTitles = [] 
    const roleIdLookup = {}
    for (const {id, job_title} of roles) {
        roleTitles.push(job_title)
        roleIdLookup[job_title] = id
    }

    const { firstName, lastName, roleTitle } = await inquirer.prompt([
        {
          type: 'input',
          name: 'firstName',
          message: 'Enter first name:'
        },
        {
          type: 'input',
          name: 'lastName',
          message: 'Enter last name:'
        },
        {
          type: 'list',
          name: 'roleTitle',
          message: 'Pick role title:',
          choices: roleTitles
        },
    ])
    console.log(firstName, lastName, roleTitle)

    const roleId = roleIdLookup[roleTitle]

    await db.promise().query(`INSERT INTO Employees (first_name, last_name, role_id, manager_id)
        VALUES ("${firstName}", "${lastName}", ${roleId}, NULL)`
    )    

    promptAction()
}

async function updateEmployee() {
    // 1. Get all employees to display a list of all employees to pick for update.
    const [employees, _] = await db.promise().query(`SELECT * FROM Employees`)  

    const employeesFullNames = [] // Used to display choices
    const employeeIdLookupObject = {} // Used to know which department id is chosen to be added
    for (const {id, first_name, last_name} of employees) {
        const fullName = `${first_name} ${last_name}` 
        employeesFullNames.push(fullName)
        employeeIdLookupObject[fullName] = id
    }

    // 2. Get all roles to display a list of all roles to pick a new role for this employee.
    const [roles] = await db.promise().query(`SELECT * FROM Roles`)  

    const roleTitles = [] 
    const roleIdLookup = {}
    for (const {id, job_title} of roles) {
        roleTitles.push(job_title)
        roleIdLookup[job_title] = id
    }

    // 3. Ask questions to get user input (which employee to update, which new role to change).
    const { employeeFullName } = await inquirer.prompt([
        {
            type: 'list',
            name: 'employeeFullName',
            message: 'Pick an employee to update: ',
            choices: employeesFullNames,
        }
    ])

    const { roleTitle } = await inquirer.prompt([
        {
            type: 'list',
            name: 'roleTitle',
            message: 'Pick a new role: ',
            choices: roleTitles,
        }
    ])

    const employeeId = employeeIdLookupObject[employeeFullName]
    const roleId = roleIdLookup[roleTitle] 

    // 4. Query to update employee role.
    await db.promise().query(`
        UPDATE Employees 
        SET role_id = ${roleId} 
        WHERE id = ${employeeId}
    `)

    promptAction()
} 

promptAction()
