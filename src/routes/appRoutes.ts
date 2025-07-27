

export const appRoutes = {
  homePage: "/",
  signInPage: "/signin",
  signUpPage: "/signup",
  dashboardPage: "/dashboard",
  // Master Page Routes
  masterRoutes: {
    masterPage: "/master",
children: {
  vendors: "/master/vendors",               // For Vendors
  clients: "/master/clients",               // For Clients
  products: "/master/products",             // For Products
  users: "/master/users",                   // For Users
  machineSpares: "/master/machine-spares",  // For Machine Spares
  problemDetails: "/master/problem-details",// For Problem Details
  },
  },
  // Error page
  errorPage: "/error",
};
