import { ServiceRequestSkeleton } from "@/components/common/skeletons";
import PaginationControls from "@/components/common/Pagination";
import ButtonSm from "@/components/common/Buttons";
import { useState } from "react";
import { useFetchServiceRequests } from "@/queries/TranscationQueries/ServiceRequestQuery";
import { useNavigate } from "react-router-dom";

const ServicePages = () => {
  const [page, setPage] = useState(1);
  const limit = 10;

  const navigate = useNavigate();
  const { data, isLoading, isError } = useFetchServiceRequests(page, limit);

  if (isLoading) {
    return <ServiceRequestSkeleton />;
  }

  if (isError) {
    return <div className="p-4 text-red-500">Failed to load data.</div>;
  }
  return (
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
    </div>
  );
};

export default ServicePages;
