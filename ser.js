function addEmployee() {
    connection.query(
      `select r.title Title,concat('$',format(r.salary,2)) Salary,d.name Department,r.id RoleID
           FROM role r
           LEFT JOIN department d ON (d.id = r.dept_id)
           ORDER BY r.title,d.name`,
      function (err, results) {
        let roleArr = [];
        if (err) throw err;
        results.forEach((element) => {
          roleArr.push(
            `${element.Title}, ${element.Department}, ${element.RoleID}`
          );
        });
        connection.query(
          `SELECT e.first_name FirstName, e.last_name LastName, d.name Department, r.title Title, e.id EmployeeID, concat(m.first_name, " ", m.last_name) Manager
               FROM employee e
               LEFT JOIN role r ON (e.role_id = r.id)
               LEFT JOIN department d ON (r.dept_id = d.id)
               LEFT JOIN employee m ON (e.manager_id = m.id)
               ORDER BY e.first_name, e.last_name, d.name, r.title`,
          (err, data) => {
            let managerArr = [];
            if (err) throw err;
            data.forEach((element) => {
              managerArr.push(
                `${element.FirstName} ${element.LastName}`
              );
            });
            inquirer
              .prompt([
                {
                  name: "first_name",
                  type: "input",
                  message: "Enter first name:",
                  validate: (answers) =>
                    answers.length > 0 || "Please enter a name",
                },
                {
                  name: "last_name",
                  type: "input",
                  message: "Enter last name:",
                  validate: (answers) =>
                    answers.length > 0 || "Please enter a name.",
                },
                {
                  name: "role_id",
                  type: "list",
                  message: "Choose role",
                  choices: roleArr,
                },
                {
                  name: "manager_id",
                  type: "list",
                  message:
                    "Choose manager",
                  choices: managerArr,
                },
              ])
              .then((answers) => {
                let role_id = answers.role_id
                connection.query(
                  "INSERT INTO employee (first_name,last_name,role_id,manager_id) values (?,?,?,?)",
                  [answers.first_name, answers.last_name, role_id, manager_id],
                  (err) => {
                    if (err) throw err;
                    initPrompt();
                  }
                );
              });
          }
        );
      }
    );
  }