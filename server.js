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

function removeEmployee() {

  mainMenu();
}

function addEmployee() {
    connection.query(
        `SELECT r.title Title, d.name Department,r.id RoleID
         FROM role r
         LEFT JOIN department d ON (d.id = r.dept_id)
         ORDER BY r.title, d.name`,
    (err, results) => {
        let roles = [];
        if(err) throw err;
        results.forEach(items => {
            roles.push(`${items.Title} ${items.Department} ${items.RoleID}`);
        });
        connection.query(
          `SELECT e.first_name FirstName, e.last_name LastName, d.name Department, r.title Title, e.id EmployeeID, concat(m.first_name, " ", m.last_name) Manager
               FROM employee e
               LEFT JOIN role r ON (e.role_id = r.id)
               LEFT JOIN department d ON (r.dept_id = d.id)
               LEFT JOIN employee m ON (e.manager_id = m.id)
               ORDER BY e.first_name, e.last_name, d.name, r.title`,
          (err, data) => {
              console.log(data)
            let managers = [];
            if (err) throw err;
            data.forEach((item) => {
              managers.push(
                `${item.FirstName} ${item.LastName} ${item.EmployeeID}`
              );
            });
            inquirer.prompt([
                {
                  name: "first_name",
                  type: "input",
                  message: "Enter first name"
                },
                {
                  name: "last_name",
                  type: "input",
                  message: "Enter last name"
                },
                {
                  name: "role_id",
                  type: "list",
                  message: "Choose role",
                  choices: roles
                },
                {
                  name: "manager_id",
                  type: "list",
                  message: "Choose manager",
                  choices: managers
                },
              ])
              .then((answers) => {
                  let role_id = parseInt(answers.role_id.split(' ').pop())
                  let manager_id = parseInt(answers.manager_id.split(' ').pop())
                connection.query(
                  "INSERT INTO employee (first_name, last_name, role_id, manager_id) values (?, ?, ?, ?)",
                  [answers.first_name, answers.last_name, role_id, manager_id],
                  (err) => {
                    if (err) throw err;
                    mainMenu();
                  }
                );
              });
          }
        );
      });
}