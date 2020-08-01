INSERT INTO department (name) VALUES ("Management"), ("Waste Management"), ("Support");
INSERT INTO role (title, salary, dept_id) 
VALUES ("Don", 1500000, 1),
("Underboss", 1000000, 1),
("Hitman", 800000, 2),
("Soldier", 400000, 3),
("Driver", 150000, 3),
("Enforcer", 520000, 2);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Anthony 'Tony'", "Soprano", 1, null),
("Corrado 'Junior'", "Soprano", 1, 1), 
("Pauly", "Gualtieri", 2, 1), 
("Salvatore 'Big Pussy'", "Bompensiero", 6, 2), 
("Silvio", "Dante", 3, 1), 
("Christopher", "Moltisanti", 4, 2);