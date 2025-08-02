import { Routes, Route, Navigate } from "react-router-dom";
import { Suspense, lazy } from "react";
import MainLayout from "./components/layout/MainLayout";

// Routes
import { appRoutes } from "./routes/appRoutes";
import { Spinner } from "./components/layout/Spinner";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import { ErrorPageContent } from "./pages/ErrorPage";
import UsersPage from "./pages/UsersPage";
import Report from "./pages/Report";
import TransactionPage from "./pages/Transaction/TransactionPage";
import MachineEntry from "./pages/Transaction/machineEntry/MachineEntries";
import QRScanner from "./pages/QR/ScanQr";
import ProblemPage from "./pages/MasterPages/Problem/ProblemPage";
import ServiceEngineerPage from "./pages/MasterPages/ServiceEngineers/ServiceEngineersPage";
import ServiceEntry from "./pages/Transaction/serviceRequest/ServiceRequest";
import ServiceRequest from "./pages/Transaction/serviceRequest/ServiceRequest";
import ServiceEntryPage from "./pages/Transaction/serviceEntry/ServiceEntry";
import RequestEntry from "./pages/RequestEntry";

// ------------------Main Pages ---------------------------
const DashBoardPage = lazy(() => import("./pages/DashBoardPage"));

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
        <Route
          path="*"
          element={
            <ErrorPageContent
              onRefresh={() => window.location.reload()}
              error={new Error("Page Not found")}
            />
          }
        />

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
              path={appRoutes.masterRoutes.children.machineSpares}
              element={<DepartmentsPage />}
            />
            <Route
              path={appRoutes.transactionRoutes.transcationPage}
              element={<TransactionPage />}
            />
            <Route
              path={appRoutes.transactionRoutes.children.machineEntry}
              element={<MachineEntry />}
            />

            <Route
              path={appRoutes.transactionRoutes.children.serviceEntry}
              element={<ServiceEntryPage/>}
            />
            <Route
              path={appRoutes.transactionRoutes.children.serviceRequest}
              element={<ServiceRequest />}
            />
            <Route path={appRoutes.scanPage} element={<QRScanner />} />
            <Route
              path={appRoutes.masterRoutes.children.problemDetails}
              element={<ProblemPage />}
            />
            <Route 
            path={appRoutes.transactionRoutes.children.serviceEntryEdit}
            element={<RequestEntry/>}
            />
            <Route
              path={appRoutes.masterRoutes.children.users}
              element={<ServiceEngineerPage />}
            />
          </Route>
        </Route>
      </Routes>
    </Suspense>
  );
};

export default App;
