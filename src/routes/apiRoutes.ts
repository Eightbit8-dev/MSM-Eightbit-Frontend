export const apiRoutes = {
  signin: "/api/auth/login",
  signup: "/api/auth/register",
  // ------------------ Master API Routes ------------------
  vendors: "/api/admin/vendors/search",
  clients: "/api/admin/clients/search",
  // ------------------ Master API Routes ------------------
  products: "/api/admin/products",
  users: "/api/admin/service-engineers",
  machineSpares: "/api/admin/spares",
  problemDetails: "/api/admin/problem-types",

  // ------------------ Transaction API Routes ------------------
  machineEntry: "/api/admin/machine",
  machineQr: "/api/admin/machine/bulk-qr-pdf",
  serviceRequest: "/api/transaction/service-request",
  serviceEntry: "/api/transaction/service-entry",

  // ------------------ old remove this later ------------------
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
