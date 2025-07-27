export const appRoutes = {
  // -------- Public Pages --------
  homePage: "/",
  signInPage: "/signin",
  signUpPage: "/signup",
  errorPage: "/error",

  // -------- Dashboard --------
  dashboardPage: "/dashboard",

  // -------- Master Routes --------
  masterRoutes: {
    masterPage: "/master",
    children: {
      vendors: "/master/vendors",
      clients: "/master/clients",
      products: "/master/products",
      users: "/master/users",
      machineSpares: "/master/machine-spares",
      problemDetails: "/master/problem-details",
    },
  },

  // -------- Transaction Routes --------
  transactionRoutes: {
    transcationPage: "/transactions",
    children: {
      // e.g., receipts: "/transactions/receipts"
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
