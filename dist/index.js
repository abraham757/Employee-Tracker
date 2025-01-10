import inquirer from 'inquirer';
import { pool } from './connection.js';
const mainMenu = async () => {
    const { choice } = await inquirer.prompt([
        {
            type: 'list',
            name: 'choice',
            message: 'What would you like to do?',
            choices: [
                'View All Employees',
                'Add Employee',
                'Update Employee Role',
                'View All Roles',
                'Add Role',
                'View All Departments',
                'Add Department',
                `Delete Employee`,
                'Quit'
            ]
        }
    ]);
    switch (choice) {
        case 'View All Employees':
            await viewEmployees();
            break;
        case 'Add Employee':
            await addEmployee();
            break;
        case 'Update Employee Role':
            await updateEmployeeRole();
            break;
        case 'View All Roles':
            await viewRoles();
            break;
        case 'Add Role':
            await addRole();
            break;
        case 'View All Departments':
            await viewDepartments();
            break;
        case 'Add Department':
            await addDepartment();
            break;
        case 'Delete Employee':
            await deleteEmployee();
            break;
        case 'Quit':
            process.exit(0);
    }
};
const viewEmployees = async () => {
    const query = `
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
        LEFT JOIN employee m ON e.manager_id = m.id
    `;
    try {
        const result = await pool.query(query);
        console.table(result.rows);
    }
    catch (err) {
        console.error('Error:', err);
    }
    await mainMenu();
};
const addEmployee = async () => {
    try {
        const [rolesResult, employeesResult] = await Promise.all([
            pool.query('SELECT id, title FROM role'),
            pool.query('SELECT id, CONCAT(first_name, \' \', last_name) as name FROM employee')
        ]);
        const roles = rolesResult.rows;
        const employees = employeesResult.rows;
        const answers = await inquirer.prompt([
            {
                type: 'input',
                name: 'firstName',
                message: "What is the employee's first name?",
                validate: (input) => input.trim() !== '' || 'First name is required'
            },
            {
                type: 'input',
                name: 'lastName',
                message: "What is the employee's last name?",
                validate: (input) => input.trim() !== '' || 'Last name is required'
            },
            {
                type: 'list',
                name: 'roleId',
                message: "What is the employee's role?",
                choices: roles.map(role => ({
                    name: role.title,
                    value: role.id
                }))
            },
            {
                type: 'list',
                name: 'managerId',
                message: "Who is the employee's manager?",
                choices: [
                    { name: 'None', value: null },
                    ...employees.map(emp => ({
                        name: emp.name,
                        value: emp.id
                    }))
                ]
            }
        ]);
        await pool.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)', [answers.firstName, answers.lastName, answers.roleId, answers.managerId]);
        console.log('Employee added successfully!');
    }
    catch (err) {
        console.error('Error:', err);
    }
    await mainMenu();
};
const updateEmployeeRole = async () => {
    const employees = (await pool.query('SELECT id, first_name, last_name FROM employee')).rows;
    const roles = (await pool.query('SELECT id, title FROM role')).rows;
    const answers = await inquirer.prompt([
        {
            type: 'list',
            name: 'employeeId',
            message: "Which employee's role do you want to update?",
            choices: employees.map(emp => ({
                name: `${emp.first_name} ${emp.last_name}`,
                value: emp.id
            }))
        },
        {
            type: 'list',
            name: 'roleId',
            message: 'Which role do you want to assign to the selected employee?',
            choices: roles.map(role => ({
                name: role.title,
                value: role.id
            }))
        }
    ]);
    try {
        await pool.query('UPDATE employee SET role_id = $1 WHERE id = $2', [answers.roleId, answers.employeeId]);
        console.log('Employee role updated successfully!');
    }
    catch (err) {
        console.error('Error:', err);
    }
    await mainMenu();
};
const viewRoles = async () => {
    const query = `
        SELECT r.id, r.title, d.name as department, r.salary
        FROM role r
        LEFT JOIN department d ON r.department_id = d.id
    `;
    try {
        const result = await pool.query(query);
        console.table(result.rows);
    }
    catch (err) {
        console.error('Error:', err);
    }
    await mainMenu();
};
const addRole = async () => {
    const departments = (await pool.query('SELECT id, name FROM department')).rows;
    const answers = await inquirer.prompt([
        {
            type: 'input',
            name: 'title',
            message: 'What is the name of the role?'
        },
        {
            type: 'input',
            name: 'salary',
            message: 'What is the salary for the role?',
            validate: (input) => !isNaN(input) || 'Please enter a valid number'
        },
        {
            type: 'list',
            name: 'departmentId',
            message: 'Which department does this role belong to?',
            choices: departments.map(dept => ({
                name: dept.name,
                value: dept.id
            }))
        }
    ]);
    try {
        await pool.query('INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3)', [answers.title, answers.salary, answers.departmentId]);
        console.log('Role added successfully!');
    }
    catch (err) {
        console.error('Error:', err);
    }
    await mainMenu();
};
const viewDepartments = async () => {
    try {
        const result = await pool.query('SELECT * FROM department');
        console.table(result.rows);
    }
    catch (err) {
        console.error('Error:', err);
    }
    await mainMenu();
};
const addDepartment = async () => {
    const answer = await inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: 'What is the name of the department?'
        }
    ]);
    try {
        await pool.query('INSERT INTO department (name) VALUES ($1)', [answer.name]);
        console.log('Department added successfully!');
    }
    catch (err) {
        console.error('Error:', err);
    }
    await mainMenu();
};
const deleteEmployee = async () => {
    // First get all employees
    const employees = (await pool.query('SELECT id, first_name, last_name FROM employee')).rows;
    const answer = await inquirer.prompt([
        {
            type: 'confirm',
            name: 'removeEmployee',
            message: 'Are you sure you want to remove this employee?'
        }
    ]);
    if (answer.removeEmployee) {
        const { employeeId } = await inquirer.prompt([
            {
                type: 'list',
                name: 'employeeId',
                message: 'Select the employee to remove:',
                choices: employees.map(emp => ({
                    name: `${emp.first_name} ${emp.last_name}`,
                    value: emp.id
                }))
            }
        ]);
        try {
            await pool.query('DELETE FROM employee WHERE id = $1', [employeeId]);
            console.log('Employee removed successfully!');
        }
        catch (err) {
            console.error('Error:', err);
        }
    }
    await mainMenu();
};
// Start the application
(async () => {
    await mainMenu(); // Display the main menu
})();
