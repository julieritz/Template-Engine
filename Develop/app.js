const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");

const firstQuestions = [
    {
        type: "input",
        message: "Enter the manager's first name:",
        name: "name"
    },
    {
        type: "input",
        message: "Enter their email address:",
        name: "email"
    },
    {
        type: "input",
        message: "Enter their employee ID:",
        name: "id"
    },
]

const initialQuestions = [
    {
        type: "input",
        message: "Enter employee's first name:",
        name: "name"
    },
    {
        type: "input",
        message: "Enter their email address:",
        name: "email"
    },
    {
        type: "input",
        message: "Enter their employee ID:",
        name: "id"
    },
]

function promptUser(questions) {
    return inquirer.prompt(questions)
}

const employeeType = [
    {
        type: "list",
        message: "What is their job title?",
        name: "role",
        choices: ['engineer', 'intern']
    }
];

const engineerQuestion = [
    {
        type: "input",
        message: "What is their GitHub user-name?",
        name: "github"
    }
];

const managerQuestion = [
    {
        type: "input",
        message: "What is their office number?",
        name: "office"
    }
];

const internQuestion = [
    {
        type: "input",
        message: "What is their school name?",
        name: "school"
    }
];

const createNewQuestion = [
    {
        type: "list",
        message: "Would you like to add another team member?",
        name: "newmember",
        choices: ["Yes", "No"]
    }
];

async function init() {
    const employees = [];
    //Get info about manager
    const managerData = await promptUser([...firstQuestions, ...managerQuestion])
    employees.push(new Manager(managerData))
    //Add team members
    let { newmember } = await promptUser(createNewQuestion)
    console.log(newmember)
    while (newmember === "Yes") {
        let employee = await createTeamMember()
        employees.push(employee)
        let next = await promptUser(createNewQuestion)
        newmember = next.newmember
    }
    console.log(employees)
    const html = render(employees)
    fs.writeFile(outputPath, html, (err) => {
        if (err) throw err;
        console.log("The file has been saved!");
    });
}

async function createTeamMember() {
    const newMember = await promptUser([...initialQuestions, ...employeeType])
    switch (newMember.role) {
        case "intern": {
            let { school } = await promptUser(internQuestion)
            newMember.school = school
            return new Intern(newMember)
        }
        case "engineer": {
            let { github } = await promptUser(engineerQuestion)
            newMember.github = github
            return new Engineer(newMember)
        }
    }
}

init();