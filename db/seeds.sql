

INSERT INTO department(id, name)
VALUES (1, 'Engineering'),
       (2, 'Sales'),
       (3, 'Legal'),
       (4, 'Finance');



INSERT INTO role(id, title, salary, department_id)  
VALUES (1, 'Software Engineer', 100000.00, 1),
       (2, 'Sales Lead', 80000.00, 2),
       (3, 'Lawyer', 120000.00, 3),
       (4, 'Accountant', 85000.00, 4);

       

INSERT INTO employee(id, first_name, last_name, role_id, manager_id)
VALUES (1, 'John', 'Doe', 1, NULL),
       (2, 'Mike', 'Chan', 2, 1),
       (3, 'Ashley', 'Rodriguez', 3, 1),
       (4, 'Kevin', 'Tupik', 4, 1),
       (5, 'Kunal', 'Singh', 1, 2);
       
