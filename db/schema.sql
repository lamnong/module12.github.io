CREATE DATABASE hw12;

CREATE TABLE IF NOT EXISTS Departments (
  id int(11) NOT NULL AUTO_INCREMENT,
  name varchar(256) NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS Roles (
  id int(11) NOT NULL AUTO_INCREMENT,
  job_title varchar(256) NOT NULL,
  salary int(11),
  department_id int(11),
  PRIMARY KEY (id),
  FOREIGN KEY (department_id) REFERENCES Departments(id) 
);

CREATE TABLE IF NOT EXISTS Employees (
  id int(11) NOT NULL AUTO_INCREMENT,
  first_name varchar(256) NOT NULL,
  last_name varchar(256) NOT NULL,
  role_id int(11),
  manager_id int(11),
  PRIMARY KEY (id),
  FOREIGN KEY (role_id) REFERENCES Roles(id),
  FOREIGN KEY (manager_id) REFERENCES Employees(id)
);
INSERT INTO Departments (name)
VALUES ("Production");

INSERT INTO Roles (job_title, salary, department_id)
VALUES ("Engineer", 80000, 2);

INSERT INTO Employees (first_name, last_name, role_id, manager_id)
VALUES ("Loc", "Tan", 1, NULL);