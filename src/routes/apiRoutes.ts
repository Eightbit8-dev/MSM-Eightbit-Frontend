export const apiRoutes = {
  signin: "/api/auth/login",
  signup: "/api/auth/register",
  // ------------------ Master API Routes ------------------
  vendors: "/api/admin/vendors",

  // ------------------ Master API Routes ------------------
  clients: "/api/admin/clients",
  products: "/api/admin/products",
  users: "/api/admin/users",
  machineSpares: "/api/admin/machine-spares",
  problemDetails: "/api/admin/problem-details",
  // ------------------ old remove this later ------------------
  spares: "/api/admin/spares",
  designations: "/api/admin/designation",
  resigination: "/api/admin/resignation",
  Bloods: "/api/admin/bloodgroup",
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

};
