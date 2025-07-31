import React from "react";
import { useFetchServiceRequests } from "../queries/TranscationQueries/ServiceRequestQuery"; // Adjust path
import ButtonSm from "../components/common/Buttons"; // Adjust path

const DashBoardPage: React.FC = () => {
  const { data, isLoading, isError } = useFetchServiceRequests(1, 10); // page 1, limit 10

  if (isLoading) return <div className="p-4">Loading...</div>;
  if (isError) return <div className="p-4 text-red-500">Failed to load data.</div>;

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
          Service Requests <span className="text-blue-500">({data?.totalRecords})</span>
        </h3>
      </section>

      {/* Data List */}
      <section className="flex w-full flex-col gap-4">
        {data?.data.map((request) => (
          <div
            key={request.id}
            className="flex flex-col rounded-md border bg-white border-gray-200 p-4 shadow-sm md:flex-row md:items-center md:justify-between"
          >
            {/* Request Info */}
            <div className="mb-4 md:mb-0">
              <p className="text-sm text-gray-600">
                <strong>Ref#:</strong> {request.referenceNumber}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Client:</strong> {request.clientName}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Machine:</strong> {request.machineType} - {request.brand} {request.modelNumber}
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
                onClick={() => alert(`Viewing request ${request.referenceNumber}`)}
              />
              <ButtonSm
                state="default"
                text="Accept"
                className="text-white"
                onClick={() => alert(`Accepted request ${request.referenceNumber}`)}
              />
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};

export default DashBoardPage;
