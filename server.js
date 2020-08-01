const inquirer = require("inquirer");
const mysql = require("mysql");
const cTable = require("console.table");
const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "garcia",
  database: "employee_tracker_db",
});

connection.connect((err) => {
  if (err) throw err;
  console.log(`connected on thread ${connection.threadId}`);
  mainMenu();
});

function mainMenu() {
  inquirer
    .prompt([
      {
        name: "mainMenu",
        message: "What would you like to do?",
        type: "list",
        choices: [
          "View Employees",
          "View Employees By Department",
          "View Employees By Manager",
          "Add Employee",
          "Remove Employee",
          "Exit",
        ],
      },
    ])
    .then((answer) => {
      switch (answer.mainMenu) {
        case "View Employees":
          viewEmployees();
          break;
        case "View Employees By Department":
          viewByDept();
          break;
        case "View Employees By Manager":
          viewByManager();
          break;
        case "Add Employee":
          addEmployee();
          break;
        case "Remove Employee":
          removeEmployee();
          break;
        default:
          connection.end();
          process.exit();
      }
    });
}

function viewEmployees() {
  connection.query(
    `SELECT employee.id, employee.first_name, employee.last_name, title Role, salary, department.name Department, CONCAT_WS(' ', e.first_name,  e.last_name) Manager FROM employee
    LEFT JOIN role ON employee.role_id = role.id
    LEFT JOIN department ON role.dept_id = department.id
    LEFT JOIN employee e ON employee.manager_id = e.id`,
    (err, data) => {
      if (err) throw err;
      console.table(data);
    }
  );
  mainMenu();
}

function viewByDept() {
  mainMenu();
}

function viewByManager() {
  mainMenu();
}

function addEmployee() {
  mainMenu();
}

function removeEmployee() {
  mainMenu();
}


