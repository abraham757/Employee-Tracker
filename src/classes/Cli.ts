// importing classes from other files
import inquirer from "inquirer";


// define the Cli class
class Cli {

    exit: boolean = false;



//method to add a new employee
    addEmployee(): void {
        inquirer
        .prompt([
            //What is the name of the department?
            {
                type: 'input',
                name: 'firstName',
                message: 'What is the employees first name?',
              },
              {
                type: 'input',
                name: 'lastName',
                message: 'What is the employees last name?',
              },
              {
                type: 'list',
                name: 'roleEmployee',
                message: 'What is the employees role?',
                // TODO: select * from roles
                choices: ['role1', 'role2','role3'],
              },
              {
                type: 'list',
                name: 'managerEmployee',
                message: 'Who is the employees manager?',
                // TODO: select * from manager
                choices: ['manager1', 'manager2','manager3'],
              },

        ])
        .then((answers)=>{
            console.log('insert into employee');
            console.log(answers.firstName);
            this.performActions();
        })
    }

      // method to perform actions on a employee
  performActions(): void {
    inquirer
    .prompt([
        {
          type: 'list',
          name: 'action',
          message: 'What would you like to do?',
          // TODO: add options to tow and wheelie
          choices: [
            'View all Employees',
            'Add Employee',
            'Update Employee Role',
            'View all Roles',
            'Add Role',
            'View All Departments',
            'Add Department',
            'Exit',
          ],
        },
      ])
      .then((answers) =>{
        if(answers.action === 'View all Employees'){
            //select * from employyee
            console.log('Readind dt all employee');

        }else if (answers.action === 'Add Employee'){
            //this.startCli();
            this.addEmployee();
            return;
         } else if (answers.action === 'Update Employee Role'){
              //this.startCli();
              console.log('Update Role employee');

            } else if (answers.action === 'View all Roles'){
              //this.startCli();
              console.log('View all Roles');
              
            }else if (answers.action === 'Add Role'){
              //this.startCli();
              console.log('Add Role');
            }else if (answers.action === 'View All Departments'){
              //this.startCli();
              console.log('View All Departments');
            }else if (answers.action === 'Add Department'){
              //this.startCli();
              console.log('Add Department');
        }else{
            // exit the cli if the user selects exit
          this.exit = true;
        }
        if (!this.exit) {
            // if the user does not want to exit, perform actions on the selected employee
            this.performActions();
          }
      });

}

}



// export the Cli class
export default Cli;