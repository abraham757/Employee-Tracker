SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name, role.salary, employee.first_name
FROM employee
LEFT JOIN role
ON role.id = employee.role_id
LEFT JOIN department
ON department.id = role.department_id;


select * from employee;

select * from role;


select * from department;

SELECT 
            e.id,
            e.first_name,
            e.last_name,
            r.title,
            d.name as department,
            r.salary,
            CONCAT(m.first_name, ' ', m.last_name) as manager
        FROM employee e
        LEFT JOIN role r ON e.role_id = r.id
        LEFT JOIN department d ON r.department_id = d.id
        LEFT JOIN employee m ON e.manager_id = m.id;

