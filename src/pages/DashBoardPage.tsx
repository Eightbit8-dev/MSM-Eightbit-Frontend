import {
  Users,
  Wrench,
  AlertTriangle,
  CheckCircle,
  UserCheck,
} from "lucide-react";
import { ServiceRequestSkeleton } from "@/components/common/skeletons";
import PaginationControls from "@/components/common/Pagination";
import ButtonSm from "@/components/common/Buttons";
import { useAuthStore } from "@/store/useAuthStore";
import { useState } from "react";
import { useFetchServiceRequests } from "@/queries/TranscationQueries/ServiceRequestQuery";
import { useNavigate } from "react-router-dom";
import { useFetchDashboardCounts } from "../queries/dashboard";
import { appRoutes } from "@/routes/appRoutes";

const DashBoardPage = () => {
  const navigate = useNavigate();
  const { data:count, isLoading :countLoading, isError:countError } = useFetchDashboardCounts();
  const { role } = useAuthStore();
   const [page, setPage] = useState(1);
    const limit = 10;
  
    const { data, isLoading, isError } = useFetchServiceRequests(page, limit);
  
    if (isLoading) {
      return <ServiceRequestSkeleton />;
    }
  
    if (isError) {
      return <div className="p-4 text-red-500">Failed to load data.</div>;
    }

  const stats = [
    {
      title: "Total Machine",
      value: count?.totalMachines ?? "0",
      textColor: "text-amber-500",
      borderColor: "border-amber-500",
      icon: Wrench,
      iconBg: "bg-amber-50",
      navigateUrl: appRoutes.transactionRoutes.children.machineEntry,
    },
    {
      title: "Breakdown Machine",
      value: count?.breakdownMachines ?? "0",
      textColor: "text-red-500",
      borderColor: "border-red-500",
      icon: AlertTriangle,
      iconBg: "bg-red-50",
      navigateUrl:
        appRoutes.transactionRoutes.children.serviceRequest +
        "?status=Not Completed",
    },
    {
      title: "Service Completed",
      value: count?.serviceCompleted ?? "0",
      textColor: "text-blue-500",
      borderColor: "border-blue-500",
      icon: CheckCircle,
      iconBg: "bg-blue-50",
      navigateUrl:
        appRoutes.transactionRoutes.children.serviceRequest + "?status=Completed",
    },
    {
      title: "Service Pending",
      value: count?.servicePending ?? "0",
      textColor: "text-gray-500",
      borderColor: "border-gray-500",
      icon: AlertTriangle,
      iconBg: "bg-gray-50",
      navigateUrl:
        appRoutes.transactionRoutes.children.serviceRequest + "?status=Pending",
    },
    {
      title: "Assigned Engineers",
      value: count?.assignedEngineers ?? "3",
      textColor: "text-green-500",
      borderColor: "border-green-500",
      icon: UserCheck,
      iconBg: "bg-green-50",
      navigateUrl: "",
    },
    {
      title: "Available Engineers",
      value: count?.availableEngineers ?? "4",
      textColor: "text-purple-500",
      borderColor: "border-purple-500",
      icon: Users,
      iconBg: "bg-purple-50",
      navigateUrl: "",
    },
  ];

  const serviceStats = [
  {
    title: "Total Service Calls",
    value: count?.availableEngineers ?? "0",
    textColor: "text-indigo-500",
    borderColor: "border-indigo-500",
    icon: Wrench,
    iconBg: "bg-indigo-50",
    navigateUrl: appRoutes.transactionRoutes.children.serviceRequest,
  },
  {
    title: "Service Completed",
    value: count?.serviceCompleted ?? "0",
    textColor: "text-blue-500",
    borderColor: "border-blue-500",
    icon: CheckCircle,
    iconBg: "bg-blue-50",
    navigateUrl:
      appRoutes.transactionRoutes.children.serviceRequest + "?status=Completed",
  },
  {
    title: "Service Pending",
    value: count?.servicePending ?? "0",
    textColor: "text-gray-500",
    borderColor: "border-gray-500",
    icon: AlertTriangle,
    iconBg: "bg-gray-50",
    navigateUrl:
      appRoutes.transactionRoutes.children.serviceRequest + "?status=Pending",
  },
];



return (
  <div className="mx-auto max-w-[1390px] self-center rounded-[24px] bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 p-4 shadow-sm">
    <div className="flex flex-col gap-2">
      {/* Show stats only if role is admin */}
      {role === "ADMIN" && (
        <section className="grid grid-cols-2 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
          {stats.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <div
                key={index}
                onClick={() => item.navigateUrl && navigate(item.navigateUrl)}
                className={`group relative flex transform cursor-pointer flex-row items-center justify-between overflow-hidden rounded-2xl border-2 border-slate-300 bg-white p-6 transition-all duration-300 hover:scale-[1.02] active:scale-105`}
              >
                <div className="flex flex-col items-start justify-start gap-3">
                  <h3 className="text-lg leading-tight font-medium text-gray-700">
                    {item.title}
                  </h3>
                  <h4
                    className={`text-xl font-medium ${item.textColor} transition-all duration-300 ease-in-out group-hover:scale-105`}
                  >
                    {countLoading ? "..." : item.value}
                  </h4>
                </div>
                <div
                  className={`rounded-xl p-3 ${item.iconBg} ${item.borderColor} border-2 transition-transform duration-300 group-hover:scale-110`}
                >
                  <IconComponent className={`h-6 w-6 ${item.textColor}`} />
                </div>
              </div>
            );
          })}
        </section>
      )}
      {role === "SERVICE" && (
  <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
    {serviceStats.map((item, index) => {
      const IconComponent = item.icon;
      return (
        <div
          key={index}
          onClick={() => item.navigateUrl && navigate(item.navigateUrl)}
          className="group relative flex transform cursor-pointer flex-row items-center justify-between overflow-hidden rounded-2xl border-2 border-slate-300 bg-white p-6 transition-all duration-300 hover:scale-[1.02] active:scale-105"
        >
          <div className="flex flex-col items-start justify-start gap-3">
            <h3 className="text-lg leading-tight font-medium text-gray-700">
              {item.title}
            </h3>
            <h4
              className={`text-xl font-medium ${item.textColor} transition-all duration-300 ease-in-out group-hover:scale-105`}
            >
              {countLoading ? "..." : item.value}
            </h4>
          </div>
          <div
            className={`rounded-xl p-3 ${item.iconBg} ${item.borderColor} border-2 transition-transform duration-300 group-hover:scale-110`}
          >
            <IconComponent className={`h-6 w-6 ${item.textColor}`} />
          </div>
        </div>
      );
    })}
  </section>
)}


      {/* This section is visible to all roles */}
      <section>
        <div className="flex flex-col gap-3 rounded-lg bg-white p-5 shadow-md">
          {/* Service Requests Section */}
          <div className="flex w-full flex-row items-center justify-between">
            <div className="flex flex-col gap-0">
              <h1 className="mb-2 text-3xl font-bold text-gray-900">
                Service Requests
              </h1>
              <p className="leading-tight text-gray-600">
                Total: {data?.totalRecords || 0} requests
              </p>
            </div>
            {/* Pagination */}
            <PaginationControls
              currentPage={page}
              totalPages={data?.totalPages || 1}
              onPageChange={setPage}
            />
          </div>
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-6">
              {data?.data.map((request) => (
                <div
                  key={request.id}
                  className="rounded-2xl border border-slate-300 bg-white p-3 transition-all duration-300"
                >
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-row items-center justify-between">
                      {/* Request Details */}
                      <div className="flex flex-col gap-1">
                        <header className="mb-3 flex items-center gap-3">
                          <h1 className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-500">
                            {request.referenceNumber}
                          </h1>
                          <span className="font-medium text-gray-600">
                            {request.clientName}
                          </span>
                        </header>
                        <section className="flex items-center gap-2">
                          <span className="text-sm text-gray-600">
                            <span className="font-medium">Machine:</span>{" "}
                            {request.machineType}
                          </span>
                          <span className="text-sm text-gray-600">
                            <span className="font-medium">Brand:</span>{" "}
                            {request.brand} {request.modelNumber}
                          </span>
                          <span className="text-sm text-gray-600">
                            <span className="font-medium">Serial No:</span>{" "}
                            {request.brand} {request.serialNumber}
                          </span>
                        </section>
                      </div>
                      <footer className="flex h-min flex-col gap-3 md:flex-row">
                        <ButtonSm
                          className="font-medium text-white"
                          text={"View"}
                          state="default"
                          type="submit"
                          onClick={() =>
                            navigate(
                              `/transactions/service-entry/create/${request.id}?mode=create`,
                            )
                          }
                        />
                      </footer>
                    </div>

                    {/* complaint details */}
                    {request.complaintDetails && (
                      <section className="mt-3 rounded-lg border-l-4 border-orange-400 bg-slate-100 p-3">
                        <p className="text-sm font-medium text-gray-700">
                          <span className="font-semibold text-orange-600">
                            Complaint:
                          </span>{" "}
                          {request.complaintDetails}
                        </p>
                      </section>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
);

};

export default DashBoardPage;
