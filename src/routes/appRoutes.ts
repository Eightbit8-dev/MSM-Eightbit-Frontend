export const appRoutes = {
  // -------- Public Pages --------
  homePage: "/",
  signInPage: "/signin",
  signUpPage: "/signup",
  errorPage: "/error",

  // -------- Dashboard --------
  dashboardPage: "/dashboard",
  dashboard: "/count",

  // -------- Master Routes --------
  masterRoutes: {
    masterPage: "/master",
    children: {
      vendors: "/master/vendors",
      clients: "/master/clients",
      products: "/master/products",
      users: "/master/service-engineers",
      machineSpares: "/master/machine-spares",
      problemDetails: "/master/problem-details",
    },
  },

  scanPage: "/Sacn-qr",

  // -------- Transaction Routes --------
  transactionRoutes: {
    transcationPage: "/transactions",
    children: {
      // e.g., receipts: "/transactions/receipts"
      machineEntry: "/transactions/machine-entry",
      serviceRequest: "/transactions/service-request",
      serviceEntry: "/transactions/service-entry",
      serviceEntryCreate: "/transactions/service-entry/create/:id",
      serviceEntryView: "/transactions/service-entry/view/:id",
      machineEdit: "/transactions/machine-edit/:id",
      machineCreate: "/transactions/machine-create",
    },
  },

  // -------- User Routes --------
  userRoutes: {
    userPage: "/users",
    children: {
      // e.g., profile: "/users/profile"
    },
  },

  // -------- Reports Routes --------
  reportRoutes: {
    reportPage: "/reports",
    children: {
      // e.g., monthly: "/reports/monthly"
    },
  },
};
