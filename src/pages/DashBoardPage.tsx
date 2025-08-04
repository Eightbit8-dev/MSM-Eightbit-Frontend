import React, { useState } from "react";
import {
  Users,
  Wrench,
  AlertTriangle,
  CheckCircle,
  UserCheck,
} from "lucide-react";

const stats = [
  {
    title: "Total Machine",
    value: "02",
    textColor: "text-amber-500",
    borderColor: "border-amber-500",
    icon: Wrench,
    iconBg: "bg-amber-50",
  },
  {
    title: "Breakdown Machine",
    value: "01",
    textColor: "text-red-500",
    borderColor: "border-red-500",
    icon: AlertTriangle,
    iconBg: "bg-red-50",
  },
  {
    title: "Service Machine",
    value: "03",
    textColor: "text-blue-500",
    borderColor: "border-blue-500",
    icon: CheckCircle,
    iconBg: "bg-blue-50",
  },
  {
    title: "Assigned Engineers",
    value: "05",
    textColor: "text-green-500",
    borderColor: "border-green-500",
    icon: UserCheck,
    iconBg: "bg-green-50",
  },
  {
    title: "Available Engineers",
    value: "07",
    textColor: "text-purple-500",
    borderColor: "border-purple-500",
    icon: Users,
    iconBg: "bg-purple-50",
  },
  {
    title: "Pending Requests",
    value: "03",
    textColor: "text-gray-500",
    borderColor: "border-gray-500",
    icon: AlertTriangle,
    iconBg: "bg-gray-50",
  },
];

import { useNavigate } from "react-router-dom";
import { useFetchServiceRequests } from "@/queries/TranscationQueries/ServiceRequestQuery";
import { DashboardSkeleton } from "@/components/common/skeletons";
import PaginationControls from "@/components/common/Pagination";
import ButtonSm from "@/components/common/Buttons";
import { appRoutes } from "@/routes/appRoutes";

const DashBoardPage = () => {
  const [page, setPage] = useState(1);
  const limit = 10;

  const navigate = useNavigate();

  const { data, isLoading, isError } = useFetchServiceRequests(page, limit);

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (isError) {
    return <div className="p-4 text-red-500">Failed to load data.</div>;
  }

  return (
    <div className="mb-16 min-h-screen rounded-xl bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 p-3 shadow-sm md:p-4 lg:p-6">
      <div className="flex flex-col gap-4">
        {/* Header */}
        <div className="flex flex-col gap-0">
          <h1 className="mb-2 text-xl leading-tight font-bold text-gray-900">
            Dashboard
          </h1>
          <p className="text-base leading-tight text-gray-600">
            Monitor your machine and engineer status
          </p>
        </div>

        {/* Stats Grid */}
        <section className="mb-4 grid grid-cols-2 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
          {stats.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <div
                key={index}
                className={`group relative flex transform cursor-pointer flex-row items-center justify-between overflow-hidden rounded-2xl border-2 border-slate-300 bg-white p-6 transition-all duration-300 hover:scale-[1.02]`}
              >
                {/* Content */}
                <div className="flex flex-col items-start justify-start gap-3">
                  <h3 className="text-lg leading-tight font-medium text-gray-700">
                    {item.title}
                  </h3>
                  <h4
                    className={`text-xl font-medium ${item.textColor} transition-all duration-300 ease-in-out group-hover:scale-105`}
                  >
                    {item.value}
                  </h4>
                </div>
                <div
                  className={`rounded-xl p-3 ${item.iconBg} ${item.borderColor} border-2 transition-transform duration-300 group-hover:scale-110`}
                >
                  <IconComponent className={`h-6 w-6 ${item.textColor}`} />
                </div>
                {/* Value Badge */}
              </div>
            );
          })}
        </section>

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
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-2">
            {data?.data.map((request) => (
              <div
                key={request.id}
                className="rounded-2xl border border-slate-300 bg-white p-6 transition-all duration-300"
              >
                <div className="flex flex-col gap-2">
                  <div className="flex flex-row items-center justify-between">
                    {/* Request Details */}
                    <div className="flex flex-col gap-1">
                      {/* header */}
                      <header className="mb-3 flex items-center gap-3">
                        <h1 className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-500">
                          {request.referenceNumber}
                        </h1>
                        <span className="font-medium text-gray-600">
                          {request.clientName}
                        </span>
                      </header>
                      {/* section */}
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
                    {/* Action Buttons */}
                    <footer className="flex h-min flex-col gap-3 md:flex-row">
                      <ButtonSm
                        className="h-min font-medium"
                        text="View"
                        state="outline"
                        type="button"
                        onClick={() =>
                          navigate(
                            appRoutes.transactionRoutes.children.serviceRequest,
                          )
                        }
                      />

                      <ButtonSm
                        className="font-medium text-white"
                        text={"Report"}
                        state="default"
                        type="submit"
                        onClick={() =>
                          navigate(
                            `/transactions/service-entry/${request.id}?mode=create`,
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
                        </span>
                        {"  "}

                        {request.complaintDetails}
                      </p>
                    </section>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions and System Status */}
      </div>
    </div>
  );
};

export default DashBoardPage;
<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
  {/* Quick Actions */}
  <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
    <h2 className="mb-4 text-xl font-semibold text-gray-900">Quick Actions</h2>
    <div className="space-y-3">
      <button className="flex w-full items-center justify-between rounded-xl border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 transition-all duration-300 hover:from-blue-100 hover:to-indigo-100">
        <span className="font-medium text-blue-700">
          Add New Service Request
        </span>
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500">
          <span className="text-lg text-white">+</span>
        </div>
      </button>
      <button className="flex w-full items-center justify-between rounded-xl border border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 p-4 transition-all duration-300 hover:from-green-100 hover:to-emerald-100">
        <span className="font-medium text-green-700">Assign Engineer</span>
        <UserCheck className="h-5 w-5 text-green-500" />
      </button>
    </div>
  </div>

  {/* System Status */}
  <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
    <h2 className="mb-4 text-xl font-semibold text-gray-900">System Status</h2>
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-gray-600">Overall Health</span>
        <div className="flex items-center space-x-2">
          <div className="h-3 w-3 animate-pulse rounded-full bg-green-400"></div>
          <span className="font-medium text-green-600">Good</span>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-gray-600">Active Alerts</span>
        <span className="rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-600">
          2
        </span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-gray-600">Pending Tasks</span>
        <span className="rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-600">
          5
        </span>
      </div>
    </div>
  </div>
</div>;
