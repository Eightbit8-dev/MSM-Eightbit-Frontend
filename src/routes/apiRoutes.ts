export const apiRoutes = {
  signin: "/api/auth/login",
  // ------------------ Master API Routes ------------------
  branches: "/api/admin/branch",
  designations: "/api/admin/designation",
  resigination: "/api/admin/resignation",
  Bloods: "/api/admin/bloodgroup",
  departments: "/api/admin/department",
  attendance: "/api/admin/attendance-types",
  attendanceTypes: "/api/admin/master-types?category=attendance_type",
  permissions: "/api/admin/permission-types",
  permissionTypes: "/api/admin/master-types?category=permission_type",
  loans: "/api/admin/loantype",
  shift: "/api/admin/shift",
  allowance: "/api/admin/allowance-deduction",
  allowanceTypes: "/api/admin/master-types?category=salary_type",
  holidays: "/api/admin/holiday",
  holidayFilter: "/api/admin/holiday/filter",
  holidaymonth: "/api/admin/months",
  holidayyears: "/api/admin/years",
  // ------------------ Employee API Routes ------------------
  employeeProfile: "/api/admin/employee-profile/summary",
  employeePrimary: "/api/admin/employee-profile/primary",
  employeeContact: "/api/admin/employee-profile/contact",
  employeeRejoin: "/api/admin/employee-rejoin",
  employeeResignation: "/api/admin/employee-resignation",,
  employeeTransfer:"/api/admin/employee-transfer",
  employeeTransferBranch:"/api/admin/employee-transfer/branch-info"
};
