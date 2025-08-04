import React, { useState } from "react";
import {
  Users,
  Wrench,
  AlertTriangle,
  CheckCircle,
  UserCheck,
  Eye,
  FileText,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const stats = [
  {
    title: "Total Machine",
    value: "02",
    bgColor: "bg-gradient-to-brr from-amber-50 to-yellow-50",
    textColor: "text-amber-600",
    borderColor: "border-amber-200",
    icon: Wrench,
    iconBg: "bg-amber-100",
  },
  {
    title: "Breakdown Machine",
    value: "01",
    bgColor: "bg-gradient-to-brr from-red-50 to-rose-50",
    textColor: "text-red-500",
    borderColor: "border-red-200",
    icon: AlertTriangle,
    iconBg: "bg-red-100",
  },
  {
    title: "Service Machine",
    value: "03",
    bgColor: "bg-gradient-to-brr from-blue-50 to-sky-50",
    textColor: "text-blue-500",
    borderColor: "border-blue-200",
    icon: CheckCircle,
    iconBg: "bg-blue-100",
  },
  {
    title: "Assigned Engineers",
    value: "05",
    bgColor: "bg-gradient-to-brr from-green-50 to-emerald-50",
    textColor: "text-green-500",
    borderColor: "border-green-200",
    icon: UserCheck,
    iconBg: "bg-green-100",
  },
  {
    title: "Available Engineers",
    value: "07",
    bgColor: "bg-gradient-to-brr from-purple-50 to-violet-50",
    textColor: "text-purple-500",
    borderColor: "border-purple-200",
    icon: Users,
    iconBg: "bg-purple-100",
  },
  {
    title: "Rejected requests",
    value: "03",
    bgColor: "bg-gradient-to-brr from-gray-50 to-slate-50",
    textColor: "text-gray-600",
    borderColor: "border-gray-200",
    icon: AlertTriangle,
    iconBg: "bg-gray-100",
  },
];

import { useNavigate } from "react-router-dom";
import { useFetchServiceRequests } from "@/queries/TranscationQueries/ServiceRequestQuery";

const DashBoardPage = () => {
  const [page, setPage] = useState(1);
  const limit = 10;

  const navigate = useNavigate();

  const { data, isLoading, isError } = useFetchServiceRequests(page, limit);

  const totalPages = Math.ceil((data?.totalRecords || 0) / limit);

  if (isLoading) {
    return (
      <div className="min-h-screenbg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 p-6">
        <div className="mx-auto max-w-7xl">
          {/* Header Skeleton */}
          <div className="mb-8">
            <div className="mb-2 h-8 w-48 animate-pulse rounded bg-gray-200"></div>
            <div className="h-4 w-80 animate-pulse rounded bg-gray-200"></div>
          </div>

          {/* Stats Grid Skeleton */}
          <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
            {Array(6)
              .fill(0)
              .map((_, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <div className="h-12 w-12 animate-pulse rounded-xl bg-gray-200"></div>
                    <div className="h-12 w-16 animate-pulse rounded-xl bg-gray-200"></div>
                  </div>
                  <div className="mb-2 h-4 w-32 animate-pulse rounded bg-gray-200"></div>
                  <div className="h-1 w-12 animate-pulse rounded bg-gray-200"></div>
                </div>
              ))}
          </div>

          {/* Service Requests Skeleton */}
          <div className="mb-8">
            <div className="mb-6 flex items-center justify-between">
              <div className="h-8 w-48 animate-pulse rounded bg-gray-200"></div>
              <div className="h-4 w-32 animate-pulse rounded bg-gray-200"></div>
            </div>

            <div className="space-y-4">
              {Array(3)
                .fill(0)
                .map((_, index) => (
                  <div
                    key={index}
                    className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
                  >
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                      <div className="flex-1 space-y-3">
                        <div className="mb-3 flex items-center gap-3">
                          <div className="h-6 w-16 animate-pulse rounded-full bg-gray-200"></div>
                          <div className="h-4 w-px bg-gray-300"></div>
                          <div className="h-4 w-32 animate-pulse rounded bg-gray-200"></div>
                        </div>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                          <div className="space-y-2">
                            <div className="h-4 w-40 animate-pulse rounded bg-gray-200"></div>
                            <div className="h-4 w-36 animate-pulse rounded bg-gray-200"></div>
                          </div>
                          <div className="space-y-2">
                            <div className="h-4 w-32 animate-pulse rounded bg-gray-200"></div>
                          </div>
                        </div>

                        <div className="mt-3 rounded-lg bg-gray-50 p-3">
                          <div className="mb-2 h-4 w-full animate-pulse rounded bg-gray-200"></div>
                          <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200"></div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-3 lg:w-32">
                        <div className="h-10 animate-pulse rounded-xl bg-gray-200"></div>
                        <div className="h-10 animate-pulse rounded-xl bg-gray-200"></div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return <div className="p-4 text-red-500">Failed to load data.</div>;
  }

  return (
    <div className="min-h-screenbg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">
            Monitor your machine and engineer status
          </p>
        </div>

        {/* Stats Grid */}
        <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
          {stats.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <div
                key={index}
                className={`relative overflow-hidden rounded-2xl border bg-white p-6 shadow-sm ${item.borderColor} group transform cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-lg`}
              >
                {/* Background Pattern */}
                <div
                  className={`absolute inset-0 ${item.bgColor} opacity-30`}
                ></div>

                {/* Content */}
                <div className="relative z-10">
                  <div className="mb-4 flex items-center justify-between">
                    <div
                      className={`rounded-xl p-3 ${item.iconBg} transition-transform duration-300 group-hover:scale-110`}
                    >
                      <IconComponent className={`h-6 w-6 ${item.textColor}`} />
                    </div>
                    {/* Value Badge */}
                    <div
                      className={`rounded-xl px-4 py-2 text-2xl font-bold ${item.textColor} border bg-white shadow-sm ${item.borderColor} transition-all duration-300 group-hover:shadow-md`}
                    >
                      {item.value}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm leading-tight font-semibold text-gray-700">
                      {item.title}
                    </h3>
                    <div
                      className={`h-1 w-12 ${item.bgColor} mt-2 rounded-full opacity-60`}
                    ></div>
                  </div>
                </div>

                {/* Hover Effect Overlay */}
                <div className="absolute inset-0 translate-x-[-100%] transform bg-gradient-to-r from-transparent via-white to-transparent opacity-0 transition-all duration-700 group-hover:translate-x-[100%] group-hover:opacity-10"></div>
              </div>
            );
          })}
        </div>

        {/* Service Requests Section */}
        <div className="mb-8">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              Service Requests
            </h2>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <span>Total: {data?.totalRecords || 0} requests</span>
            </div>
          </div>

          <div className="space-y-4">
            {data?.data.map((request) => (
              <div
                key={request.id}
                className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md"
              >
                <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                  {/* Request Details */}
                  <div className="flex-1 space-y-3">
                    <div className="mb-3 flex items-center gap-3">
                      <div className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
                        {request.referenceNumber}
                      </div>
                      <div className="h-4 w-px bg-gray-300"></div>
                      <span className="font-medium text-gray-600">
                        {request.clientName}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Wrench className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            <span className="font-medium">Machine:</span>{" "}
                            {request.machineType}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="flex h-4 w-4 items-center justify-center">
                            <div className="h-2 w-2 rounded-full bg-gray-400"></div>
                          </span>
                          <span className="text-sm text-gray-600">
                            <span className="font-medium">Brand:</span>{" "}
                            {request.brand} {request.modelNumber}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="flex h-4 w-4 items-center justify-center">
                            <div className="h-2 w-2 rounded-full bg-gray-400"></div>
                          </span>
                          <span className="text-sm text-gray-600">
                            <span className="font-medium">Serial:</span>{" "}
                            {request.serialNumber}
                          </span>
                        </div>
                      </div>
                    </div>

                    {request.complaintDetails && (
                      <div className="mt-3 rounded-lg border-l-4 border-orange-400 bg-gray-50 p-3">
                        <p className="text-sm text-gray-700">
                          <span className="font-medium text-orange-600">
                            Complaint:
                          </span>{" "}
                          {request.complaintDetails}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col gap-3 sm:flex-row lg:w-32 lg:flex-col">
                    <button
                      onClick={() =>
                        navigate(`/transactions/service-request/${request.id}`)
                      }
                      className="flex items-center justify-center gap-2 rounded-xl border border-gray-300 px-4 py-2.5 font-medium text-gray-700 transition-all duration-200 hover:border-gray-400 hover:bg-gray-50"
                    >
                      <Eye className="h-4 w-4" />
                      <span>View</span>
                    </button>
                    <button
                      onClick={() =>
                        navigate(
                          `/transactions/service-entry/${request.id}?mode=create`,
                        )
                      }
                      className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 font-medium text-white shadow-sm transition-all duration-200 hover:bg-blue-700"
                    >
                      <FileText className="h-4 w-4" />
                      <span>Report</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-8 flex items-center justify-between rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 transition-colors duration-200 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="font-medium">Previous</span>
            </button>

            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                Page <span className="font-medium text-gray-900">{page}</span>{" "}
                of{" "}
                <span className="font-medium text-gray-900">{totalPages}</span>
              </span>
              <div className="flex items-center gap-1">
                {[...Array(Math.min(5, totalPages))].map((_, i) => {
                  const pageNum = i + 1;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      className={`h-8 w-8 rounded-lg text-sm font-medium transition-all duration-200 ${
                        page === pageNum
                          ? "bg-blue-600 text-white shadow-sm"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 transition-colors duration-200 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <span className="font-medium">Next</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Quick Actions and System Status */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Quick Actions */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold text-gray-900">
              Quick Actions
            </h2>
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
                <span className="font-medium text-green-700">
                  Assign Engineer
                </span>
                <UserCheck className="h-5 w-5 text-green-500" />
              </button>
            </div>
          </div>

          {/* System Status */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold text-gray-900">
              System Status
            </h2>
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
        </div>
      </div>
    </div>
  );
};

export default DashBoardPage;
