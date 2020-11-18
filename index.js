const { prompt } = require("inquirer");
const logo = require("asciiart-logo");
const db = require("./db");
const { updateEmployeeRole, updateEmployeeManager, removeDepartment, removeRole } = require("./db");
require("console.table");

init();

// Display logo text, load main prompts
function init() {
  const logoText = logo({ name: "Employee Manager" }).render();

  console.log(logoText);

  loadMainPrompts();
}

async function loadMainPrompts() {
  const { choice } = await prompt([
    {
      type: "list",
      name: "choice",
      message: "What would you like to do?",
      choices: [
        {
          name: "View All Employees",
          value: "VIEW_EMPLOYEES"
        },
        {
          name: "View All Employees By Department",
          value: "VIEW_EMPLOYEES_BY_DEPARTMENT"
        },
        {
          name: "View All Employees By Manager",
          value: "VIEW_EMPLOYEES_BY_MANAGER"
        },
        {
          name: "Add Employee",
          value: "ADD_EMPLOYEE"
        },
        {
          name: "Remove Employee",
          value: "REMOVE_EMPLOYEE"
        },
        //You will need to complete the rest of the switch statement
        {
          name: "Update Employee Role",
          value: "UPDATE_EMPLOYEE_ROLE"
        },
        {
          name: "Update Employee Manager",
          value: "UPDATE_EMPLOYEE_MANAGER"
        },
        {
          name: "View All Roles",
          value: "VIEW_ROLES"
        },
        {
          name: "Add Role",
          value: "ADD_ROLE"
        },
        {
          name: "Remove Role",
          value: "REMOVE_ROLE"
        },
        {
          name: "View All Departments",
          value: "VIEW_DEPARTMENTS"
        },
        {
          name: "Add Department",
          value: "ADD_DEPARTMENT"
        },
        {
          name: "Remove Department",
          value: "REMOVE_DEPARTMENT"
        },
        {
          name: "Quit",
          value: "QUIT"
        }
      ]
    }
  ]);

  // Call the appropriate function depending on what the user chose
  switch (choice) {
    case "VIEW_EMPLOYEES":
      return viewEmployees();
    case "VIEW_EMPLOYEES_BY_DEPARTMENT":
      return viewEmployeesByDepartment();
    case "VIEW_EMPLOYEES_BY_MANAGER":
      return viewEmployeesByManager();
    case "ADD_EMPLOYEE":
      return addEmployee();
    case "REMOVE_EMPLOYEE":
      return removeEmployee();
    //You will need to complete the rest of the cases 
    case "UPDATE_EMPLOYEE_ROLE":
      return updateEmployeeRole();
    case "UPDATE_EMPLOYEE_MANAGER":
      return updateEmployeeManager();
    case "VIEW_DEPARTMENTS":
      return viewDepartments();
    case "ADD_DEPARTMENT":
      return addDepartment();
    case "REMOVE_DEPARTMENT":
      return removeDepartment();
    case "VIEW_ROLES":
      return viewRoles();
    case "ADD_ROLE":
      return addRole();
    case "REMOVE_ROLE":
      return removeRole();
    default:
      return quit();
  }
}

async function viewEmployees() {
  const employees = await db.findAllEmployees();

  console.log("\n");

  console.table(employees);

  loadMainPrompts();
}

async function viewEmployeesByDepartment() {
  const departments = await db.findAllDepartments();

  const departmentChoices = departments.map(({ id, name }) => ({
    name: name,
    value: id
  }));

  const { departmentId } = await prompt([
    {
      type: "list",
      name: "departmentId",
      message: "Which department would you like to see employees for?",
      choices: departmentChoices
    }
  ]);

  const employees = await db.findAllEmployeesByDepartment(departmentId);

  console.log("\n");
  console.table(employees);

  loadMainPrompts();
}

async function viewEmployeesByManager() {
  const managers = await db.findAllEmployees();

  const managerChoices = managers.map(({ id, first_name, last_name }) => ({
    name: `${first_name} ${last_name}`,
    value: id
  }));

  const { managerId } = await prompt([
    {
      type: "list",
      name: "managerId",
      message: "Which employee do you want to see direct reports for?",
      choices: managerChoices
    }
  ]);

  const employees = await db.findAllEmployeesByManager(managerId);

  console.log("\n");

  if (employees.length === 0) {
    console.log("The selected employee has no direct reports");
  } else {
    console.table(employees);
  }

  loadMainPrompts();
}

async function removeEmployee() {
  const employees = await db.findAllEmployees();

  const employeeChoices = employees.map(({ id, first_name, last_name }) => ({
    name: `${first_name} ${last_name}`,
    value: id
  }));

  const { employeeId } = await prompt([
    {
      type: "list",
      name: "employeeId",
      message: "Which employee do you want to remove?",
      choices: employeeChoices
    }
  ]);

  await db.removeEmployee(employeeId);

  console.log("Removed employee from the database");

  loadMainPrompts();
}

async function addEmployee() {
  const roles = await db.findAllRoles();
  const employees = await db.findAllEmployees();

  const employee = await prompt([
    {
      name: "first_name",
      message: "What is the employee's first name?"
    },
    {
      name: "last_name",
      message: "What is the employee's last name?"
    }
  ]);
}

// -------------------------------------

async function  updateEmployeeRole() {
  const employees = await db.findAllEmployees();
  const employeeChoices = employees.map(({id, first_name, last_name}) => ({
    name: `${first_name} ${last_name}`,
    value: id
  }));

  const {employeeId} = await prompt([
    {
      type: "list",
      name: "employeeId",
      message: "Which employee's role would you like to update?",
      choices: employeeChoices
    }
  ]);

  const roles = await db.findAllRoles();
  const roleChoices = roles.map(({id, title}) => ({
    name: title,
    value: id
  }));
  const {roleId} = await prompt ([
    {
      type: "list",
      name: "roleId",
      message: "What should the employee's new role be?",
      choices: roleChoices
    }
  ]);
  await db.updateEmployeeRole(employeeId, roleId);
  console.log("Employee's role was updated.");
  loadMainPrompts();
}

async function updateEmployeeManager() {
  const employees = await db.findAllEmployees();
  const employeeChoices = employees.map(({id, first_name, last_name}) => ({
    name: `${first_name} ${last_name}`,
    value: id
  }));
  const {employeeId} = await prompt([
    {
      type: "list",
      name: "employeeId",
      message: "Which employee's manager do you want to update?",
      choices: employeeChoices
    }
  ]);
  const managers = await db.findAllPossibleManagers(employeeId);
  const managerChoices = managers.map(({id, first_name, last_name}) => ({
    name: `${first_name} ${last_name}`,
    value: id
  }));
  const {managerId} = await prompt([
    {
      type: "list", 
      name: "managerId",
      message: "Pick a new manager for the selected employee.",
      choices:  managerChoices
    }
  ]);
  await db.updateEmployeeManager(employeeId, managerId);
  console.log("You updated the employee's manager.")
  loadMainPrompts();
}

async function viewRoles() {
  const roles = await db.findAllRoles();
console.log("\n")
console.table(roles);
loadMainPrompts();
}

async function addRole() {
  const departments = await db.findAllDepartments();
  const departmentChoices = departments.map(({id, name}) => ({
    name: name,
    value: id
  }));
  const role = await prompt([
    {
      name: "title",
      message: "What is the name of the role?"
    },
    {
      name: "salary",
      message: "What will the salary of the role be?"
    },
    {
type: "list",
name: "department_id",
message: "What department will the role be in?",
choices: departmentChoices
    }
  ]);
  await db.createRole(role);
  console.log("You added a new role.")
  loadMainPrompts();
}

async function removeRole() {
  const roles = await db.findAllRoles();
  constroleChoices = roles.map(({id, title}) => ({
    name: title,
    value: id
  }));
  const{roleId} = await prompt([
    {
      type: "list",
      name: "roleId",
      message: "Which role do you want to remove?",
      choices: roleChoices
    }
  ]);
  await db.removeRole(roleId);
  console.log("You removed a role from the database.");
  loadMainPrompts();
}

async function viewDepartments() {
  const departments = await db.findAllDepartments();
  console.log("\n");
  console.table(departments);
  loadMainPrompts();
}

async function addDepartment() {
  const department = await prompt([
    {
      name: "name",
      message: "What is the name of the department you want to add?"
    }
  ]);
  await db.createDepartment(department);
  console.log("You added a new department.")
  loadMainPrompts();

}

async function removeDepartment() {
  const departments = await db.findAllDepartments();
  const deparmentChoices = departments.map(({id, name}) => ({
    name: name,
    value: id
  }));
  const {departmentId} = await prompt({
    type: "list",
    name: "departmentId",
    message: "Which department would you like to remove?",
    choices: deparmentChoices
  });
  await db.removeDepartment(departmentId);
  console.log("You removed a department.");
  loadMainPrompts();
}

async function addEmployee() {
  const roles = await db.findAllRoles();
  const employees = await db.findAllEmployees();
  const employee = await prompt([
    {
      name: "first_name",
      message: "What is the first name of the employee?"
    },
    {
      name: "last_name",
      message: "What is the last name of the employee?"
    }
  ]);
  const roleChoices = roles.map(({id, title}) => ({
    name: title,
    value: id
  }));
  const {roleId} = await prompt({
    type: "list",
    name: "roleId",
    message: "What is the employee's role?",
    choices: roleChoices
});
employee.role_id = roleId;
const managerChoices = employees.map(({id, first_name, last_name}) => ({
  name: `${first_name} ${last_name}`,
  value: id
}));
managerChoices.unshift({name: "None", value: null});
const {managerId} = await prompt({
  type: "list",
  name: "managerId",
  message: "Who will be the employee's manager?",
  choices: managerChoices
});
employee.manager_id = managerId;
await db.createEmployee(employee);
console.log("You added a new employee.");
loadMainPrompts();
}

// -------------------------------------
function quit() {
  console.log("Goodbye!");
  process.exit();
}
