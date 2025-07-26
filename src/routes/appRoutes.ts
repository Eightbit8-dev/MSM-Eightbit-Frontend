export const appRoutes = {
  homePage: "/",
  signInPage: "/signin",
  dashboardPage: "/dashboard",
  // Master Page Routes
  masterRoutes: {
    masterPage: "/master",
    children: {
      branches: "/master/branches",
      departments: "/master/departments",
      designations: "/master/designations",
      resignations: "/master/resignations",
      bloodGroups: "/master/blood-groups",
      attendance: "/master/attendance",
      permissions: "/master/permissions",
      lop: "/master/lop",
      shifts: "/master/shifts",
      holidays: "/master/holidays",
      loans: "/master/loans",
      allowances: "/master/allowances",
    },
  },
  // Employee page
  employeesRoute: {
    employeesPage: "/employees",
    children: {
      staffsProfile: "/employees/profile",
      staffProfile: "/employees/profile/:staffId",
      branchTransfer: "/employees/branch-transfer",
      staffRejoin: "/employees/rejoin",
      resignation: "/employees/resignation",
    },
  },
  attendancePage: "/attendance",
  loanPage: "/loan",
  // Error page
  errorPage: "/error",
};
