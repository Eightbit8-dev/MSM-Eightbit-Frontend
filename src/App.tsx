import { Routes, Route, Navigate } from "react-router-dom";
import { Suspense, lazy } from "react";
import MainLayout from "./components/layout/MainLayout";

// Routes
import { appRoutes } from "./routes/appRoutes";
import { Spinner } from "./components/layout/Spinner";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import TransactionPage from "./pages/TransactionPage";
import UsersPage from "./pages/UsersPage";
import Report from "./pages/Report";

// ------------------Main Pages ---------------------------
const DashBoardPage = lazy(() => import("./pages/DashBoardPage"));
const ErrorPage = lazy(() => import("./pages/ErrorPage"));
const SignInPage = lazy(() => import("./pages/SignInPage"));

// ---------------Master Pages----------------------------
const MasterPage = lazy(() => import("./pages/MasterPages/MasterPage"));
const ResignationPage = lazy(
  () => import("./pages/MasterPages/Product/ProductPage"),
);
const DesignationsPage = lazy(
  () => import("./pages/MasterPages/Client/ClientPage"),
);
const VendorsPage = lazy(() => import("./pages/MasterPages/Vendor/VendorPage"));
const DepartmentsPage = lazy(
  () => import("./pages/MasterPages/Spares/SparesPage"),
);
const LoanMPage = lazy(() => import("./pages/MasterPages/Problem/ProblemPage"));
const Bloodpage = lazy(() => import("./pages/MasterPages/Users/UsersPage"));

const App = () => {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen w-full items-center justify-center">
          <Spinner />
        </div>
      }
    >
      <Routes>
        {/* Auth route */}
        <Route path={appRoutes.signInPage} element={<SignInPage />} />

        {/* Other Routes */}
        <Route
          path="/"
          element={<Navigate to={appRoutes.dashboardPage} replace />}
        />

        <Route path="*" element={<ErrorPage />} />

        {/* Main Layout Routes */}
        {/* These are all authenticated routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path={appRoutes.dashboardPage} element={<DashBoardPage />} />
            <Route
              path={appRoutes.reportRoutes.reportPage}
              element={<Report />}
            />

            <Route
              path={appRoutes.transactionRoutes.transcationPage}
              element={<TransactionPage />}
            />
            <Route
              path={appRoutes.userRoutes.userPage}
              element={<UsersPage />}
            />
            {/* Master Page and its nested components */}
            <Route
              path={appRoutes.masterRoutes.masterPage}
              element={<MasterPage />}
            />
            {/* Vendors pages */}
            <Route
              path={appRoutes.masterRoutes.children.vendors}
              element={<VendorsPage />}
            />
            {/* Clients pages */}
            <Route
              path={appRoutes.masterRoutes.children.clients}
              element={<DesignationsPage />}
            />
            <Route
              path={appRoutes.masterRoutes.children.products}
              element={<ResignationPage />}
            />
            <Route
              path={appRoutes.masterRoutes.children.users}
              element={<Bloodpage />}
            />

            <Route
              path={appRoutes.masterRoutes.children.machineSpares}
              element={<DepartmentsPage />}
            />
            <Route
              path={appRoutes.masterRoutes.children.problemDetails}
              element={<LoanMPage />}
            />
          </Route>
        </Route>
      </Routes>
    </Suspense>
  );
};

export default App;
