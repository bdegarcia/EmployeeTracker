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
// this application was a collaboration between Ben de Garcia and Brianna Bullock
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
          "Add Employee",
          "Remove Employee",
          "View All Departments",
          "View All Roles",
          "Add Department",
          "Add Role",
          "Update Roll",
          "Exit",
        ],
      },
    ])
    .then((answer) => {
      switch (answer.mainMenu) {
        case "View Employees":
          viewEmployees();
          break;
        case "Add Employee":
          addEmployee();
          break;
        case "Add Department":
          addDept();
          break;
        case "Add Role":
          addRole();
          break;
        case "Update Roll":
          updateRoll();
          break;
        case "Remove Employee":
          removeEmployee();
          break;
        case "View All Departments":
          allDepts();
          break;
        case "View All Roles":
          allRoles();
          break;
        default:
          connection.end();
          process.exit();
      }
    });
}
//this was made by Brianna
function allDepts() {
  console.log("Displaying all the departments...");
  connection.query("SELECT id, name Department FROM department", function (
    err,
    results
  ) {
    if (err) throw err;
    const table = cTable.getTable(results);
    console.log(table);
    mainMenu();
  });
}

function allRoles() {
  console.log("Grabbing all the roles...");
  connection.query(
    'SELECT id AS "ID", title AS "Title", salary AS "Salary" FROM role',
    function (err, results) {
      if (err) throw err;
      const table = cTable.getTable(results);
      console.log(table);
      mainMenu();
    }
  );
}

function viewEmployees() {
  getEmployees((data) => {
    const table = cTable.getTable(data);
    console.log(table);
    mainMenu();
  });
}
function getEmployees(cb) {
  connection.query(
    `SELECT employee.id, employee.first_name, employee.last_name, title Role, salary, department.name Department, CONCAT_WS(' ', e.first_name,  e.last_name) Manager FROM employee
        LEFT JOIN role ON employee.role_id = role.id
        LEFT JOIN department ON role.dept_id = department.id
        LEFT JOIN employee e ON employee.manager_id = e.id`,
    (err, data) => {
      if (err) throw err;
      cb(data);
    }
  );
}
//This was written by Brianna Bullock
function addDept() {
  inquirer
    .prompt([
      {
        name: "dept_name",
        type: "input",
        message: "What department would you like to add?",
      },
    ])
    .then((answer) => {
      connection.query(
        "INSERT INTO department (name) VALUES (?)",
        answer.dept_name,
        (err, results) => {
          if (err) throw err;
          console.log(`${answer.dept_name} was added.`);
        }
      );
      mainMenu();
    });
}
//work in progress
function updateRoll() {
  getEmployees(function (data) {
    connection.query("SELECT id FROM role");
    console.log(data);
    let employeeList = [];
    let roleList = [];
    data.forEach((item) => {
      employeeList.push(
        `${item.first_name} ${item.last_name}, role: ${item.Department}`
      );
    });
    data.forEach((item) => {
      roleList.push(`${item.department}`);
    });
  });
  inquirer
    .prompt([
      {
        name: "employee",
        message: "Who's role would you like to change?",
        type: "list",
        choices: employeeList,
      },
      {
        name: "newRole",
        message: "What is their new role?",
        type: "list",
        choices: rollList,
      },
    ])
    .then((answers) => {
      connection.query(`INSERT INTO employees  `);
    });
}

function addRole() {
  connection.query("SELECT * FROM department", function (err, results) {
    if (err) throw err;
    let depArr = [];
    results.forEach((result) => {
      depArr.push(`${result.name} - ${result.id}`);
    });
    // })
    inquirer
      .prompt([
        {
          name: "title",
          type: "input",
          message: "What role would you like to add?",
        },
        {
          name: "salary",
          type: "input",
          message: "What is the salary for this role?",
        },
        {
          name: "dept_choice",
          type: "list",
          message: "Choose an existing department",
          choices: depArr,
        },
      ])
      .then((answers) => {
        let deptID = parseInt(answers.dept_choice.split("-").pop());
        connection.query(
          "INSERT INTO role (title, salary, dept_id) VALUES (?, ?, ?)",
          [answers.title, answers.salary, deptID],
          function (err, results) {
            if (err) throw err;
            const table = cTable.getTable(allRoles(results));
            console.log(table);
            console.log(`${answers.title} added to the list of roles.`);
          }
        );
        mainMenu();
      });
  });
}
function removeEmployee() {
  getEmployees(function (data) {
    let employeeList = [];
    data.forEach((item) => {
      employeeList.push(
        `${item.first_name} ${item.last_name}, Employee# ${item.id}`
      );
    });
    inquirer
      .prompt([
        {
          name: "employee",
          type: "list",
          message: "Who is no longer on the crew?",
          choices: employeeList,
        },
      ])
      .then((answer) => {
        let firedEmpID = answer.employee.split(" ").pop();
        connection.query(
          "DELETE FROM employee WHERE id = ?",
          firedEmpID,
          (err, data) => {
            if (err) throw err;
            console.log(`He is Done.`);
            mainMenu();
          }
        );
      });
  });

}
function addEmployee() {
  connection.query(
    `SELECT r.title Title, d.name Department,r.id RoleID
         FROM role r
         LEFT JOIN department d ON (d.id = r.dept_id)
         ORDER BY r.title, d.name`,
    (err, data) => {
      let roles = [];
      if (err) throw err;
      data.forEach((items) => {
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
          let managers = [];
          if (err) throw err;
          data.forEach((item) => {
            managers.push(
              `${item.FirstName} ${item.LastName} ${item.EmployeeID}`
            );
          });
          inquirer
            .prompt([
              {
                name: "first_name",
                type: "input",
                message: "Enter first name",
              },
              {
                name: "last_name",
                type: "input",
                message: "Enter last name",
              },
              {
                name: "role_id",
                type: "list",
                message: "Choose role",
                choices: roles,
              },
              {
                name: "manager_id",
                type: "list",
                message: "Choose manager",
                choices: managers,
              },
            ])
            .then((answers) => {
              let role_id = parseInt(answers.role_id.split(" ").pop());
              let manager_id = parseInt(answers.manager_id.split(" ").pop());
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
    }
  );
}
