import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFetchServiceRequests } from "../queries/TranscationQueries/ServiceRequestQuery";
import ButtonSm from "../components/common/Buttons";
import StaffProfileSkeleton from "./Transaction/PageSkeleton";
import { appRoutes } from "@/routes/appRoutes";

const stats = [
  {
    title: "Total Machine",
    value: "02",
    bgColor: "bg-[#F2EFE1]",
    textColor: "text-[#FF9F00]",
    borderColor: "border-[#F7D251]",
  },
  {
    title: "Breakdown Machine",
    value: "01",
    bgColor: "bg-[#FFECEC]",
    textColor: "text-[#FF0000]",
    borderColor: "border-[#FF8A8A]",
  },
  {
    title: "Service Machine",
    value: "03",
    bgColor: "bg-[#E8F6FF]",
    textColor: "text-[#00A3FF]",
    borderColor: "border-[#6BD8FF]",
  },
  {
    title: "Assigned Engineers",
    value: "05",
    bgColor: "bg-[#E9FCEF]",
    textColor: "text-[#00C853]",
    borderColor: "border-[#74E69D]",
  },
  {
    title: "Available Engineers",
    value: "07",
    bgColor: "bg-[#F4EEFF]",
    textColor: "text-[#7E57C2]",
    borderColor: "border-[#B39DDB]",
  },
];

const DashBoardPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const limit = 10;

  const navigate = useNavigate();
  const { data, isLoading, isError } = useFetchServiceRequests(page, limit);

  if (isLoading) return <StaffProfileSkeleton />;
  if (isError)
    return <div className="p-4 text-red-500">Failed to load data.</div>;

  const totalPages = Math.ceil((data?.totalRecords || 0) / limit);

  return (
    <div className="dashboard-page-container flex w-full flex-col px-6 py-4">
      {/* Header */}
      <section className="mb-6 flex items-center gap-2 text-lg font-medium">
        <button className="back-button cursor-pointer rounded-full bg-slate-100 p-1 transition-all duration-150 ease-in-out hover:bg-slate-200 active:bg-blue-500">
          <img
            className="rotate-180 transform"
            src="./icons/arrow-icon.svg"
            alt="back"
          />
        </button>
        <h3 className="text-zinc-800">
          Service Requests{" "}
          <span className="text-blue-500">({data?.totalRecords})</span>
        </h3>
      </section>

      {/* Dash Stats Boxes */}
      <section className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((item, index) => (
          <div
            key={index}
            className="flex h-[100px] transform cursor-pointer flex-row items-center justify-center rounded-[9px] bg-white transition-transform duration-200 hover:scale-105 hover:shadow-md"
          >
            <div className="flex w-[50%] items-center justify-center px-3 py-3">
              <p className={`text-[16px] font-medium ${item.textColor}`}>
                {item.title}
              </p>
            </div>
            <div className="flex w-[50%] items-center justify-center">
              <p
                className={`rounded-[9px] ${item.bgColor} w-fit p-4 ${item.textColor} border ${item.borderColor}`}
              >
                {item.value}
              </p>
            </div>
          </div>
        ))}
      </section>

      {/* Service Request List */}
      <section className="flex w-full flex-col gap-4">
        {data?.data.map((request) => (
          <div
            key={request.id}
            className="flex flex-col rounded-md border border-gray-200 bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between"
          >
            <div className="mb-4 md:mb-0">
              <p className="text-sm text-gray-600">
                <strong>Ref#:</strong> {request.referenceNumber}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Client:</strong> {request.clientName}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Machine:</strong> {request.machineType} -{" "}
                {request.brand} {request.modelNumber}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Serial:</strong> {request.serialNumber}
              </p>
              {request.complaintDetails && (
                <p className="text-sm text-gray-600">
                  <strong>Complaint:</strong> {request.complaintDetails}
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <ButtonSm
                state="outline"
                text="View"
                onClick={() =>
                  navigate(appRoutes.transactionRoutes.children.serviceRequest)
                }
              />
              <ButtonSm
                state="default"
                text="Report"
                className="text-white"
                onClick={() =>
                  navigate(
                    `/transactions/service-entry/${request.id}?mode=create`,
                  )
                }
              />
            </div>
          </div>
        ))}
      </section>

      {/* Pagination Controls */}
      <section className="mt-6 flex items-center justify-between">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className="rounded bg-gray-200 px-4 py-2 hover:bg-gray-300 disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-gray-600">
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages}
          className="rounded bg-gray-200 px-4 py-2 hover:bg-gray-300 disabled:opacity-50"
        >
          Next
        </button>
      </section>
    </div>
  );
};

export default DashBoardPage;
