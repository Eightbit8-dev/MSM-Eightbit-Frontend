import React, { useState } from "react";
import { useFetchClientOptions } from "@/queries/masterQueries/ClientQuery";
import { useFetchModelsOptions } from "../../queries/masterQueries/ProductQuery";
import { useFetchServiceEngineerOptions } from "../../queries/masterQueries/ServiceEngineersQuery";
import { useFetchProblemOptions } from "../../queries/masterQueries/Problem-types";
import DropdownSelect from "@/components/common/DropDown";
import { DateInput } from "../../components/common/Input";
import PageHeader from "@/components/masterPage.components/PageHeader";
import ButtonSm from "@/components/common/Buttons";
import { useGenerateReportPDF } from "@/queries/reportsQuery";

interface Filters {
  clientName: string;
  model: string;
  serviceDate: string;
  technician: string;
  complaint: string;
  status: string;
  refDateFrom: string;
  refDateTo: string;
}

const CustomerReport: React.FC = () => {
  const [filters, setFilters] = useState<Filters>({
    clientName: "",
    model: "",
    serviceDate: "",
    technician: "",
    complaint: "",
    status: "",
    refDateFrom: "",
    refDateTo: "",
  });

  const { mutate: generateReport, isPending } = useGenerateReportPDF();

  const { data: brandOptions = [] } = useFetchModelsOptions();
  const { data: serviceOptions = [] } = useFetchServiceEngineerOptions();
  const { data: clientOptions = [] } = useFetchClientOptions();
  const { data: problemOptions = [] } = useFetchProblemOptions();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.nativeEvent as SubmitEvent;
    const submitter = form.submitter as HTMLButtonElement;

    const isViewOnly = submitter?.value === "view";

    generateReport({
      params: {
        clientName: filters.clientName || undefined,
        model: filters.model || undefined,
        serviceDate: filters.serviceDate || undefined,
        technician: filters.technician || undefined,
        complaint: filters.complaint || undefined,
        status: filters.status || undefined,
      },
      isViewOnly,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="container mx-auto flex min-h-screen flex-col gap-4 rounded-xl bg-white/80 p-6"
    >
      <PageHeader title="Customer Report" />

      <div className="mb-6 rounded-xl bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold text-gray-700">
          Filter Options
        </h2>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <DropdownSelect
            title="Client"
            options={clientOptions}
            selected={
              clientOptions.find((c) => c.label === filters.clientName) || {
                id: 0,
                label: "Select Client",
              }
            }
            required
            onChange={(val) =>
              setFilters({ ...filters, clientName: val.label })
            }
          />

          <DropdownSelect
            title="Model"
            options={brandOptions}
            selected={
              brandOptions.find((b) => b.label === filters.model) || {
                id: 0,
                label: "Select Model",
              }
            }
            onChange={(val) => setFilters({ ...filters, model: val.label })}
          />

          <DateInput
            title="Ref Date From"
            value={filters.refDateFrom}
            onChange={(val) => setFilters({ ...filters, refDateFrom: val })}
            name="refDateFrom"
          />

          <DateInput
            title="Ref Date To"
            value={filters.refDateTo}
            onChange={(val) => setFilters({ ...filters, refDateTo: val })}
            name="refDateTo"
          />

          <DateInput
            title="Service Date"
            value={filters.serviceDate}
            onChange={(val) => setFilters({ ...filters, serviceDate: val })}
            name="serviceDate"
          />

          <DropdownSelect
            title="Technician"
            options={serviceOptions}
            selected={
              serviceOptions.find((s) => s.label === filters.technician) || {
                id: 0,
                label: "Select Technician",
              }
            }
            onChange={(val) =>
              setFilters({ ...filters, technician: val.label })
            }
          />

          <DropdownSelect
            title="Complaint"
            options={problemOptions}
            selected={
              problemOptions.find((p) => p.label === filters.complaint) || {
                id: 0,
                label: "Select Complaint",
              }
            }
            onChange={(val) => setFilters({ ...filters, complaint: val.label })}
          />

          <DropdownSelect
            title="Status"
            options={[
              { id: 1, label: "Completed" },
              { id: 2, label: "Not Completed" },
            ]}
            selected={
              [
                { id: 1, label: "Completed" },
                { id: 2, label: "Not Completed" },
              ].find((p) => p.label === filters.status) || {
                id: 0,
                label: "Select Status",
              }
            }
            onChange={(val) => setFilters({ ...filters, status: val.label })}
          />
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex justify-end gap-4">
          <ButtonSm
            state="default"
            name="action"
            value="view"
            type="submit"
            text="Generate Report"
            disabled={isPending}
            className="mt-auto flex cursor-pointer items-center gap-2 rounded-[12px] bg-[#3A74D3] px-3 py-3 text-base font-medium text-white transition-colors duration-200 hover:bg-[#2a5bb0] active:bg-[#2a5bb0]"
          />
          <ButtonSm
            state="default"
            name="action"
            value="download"
            disabled={isPending}
            type="submit"
            text="Download Report"
            className="mt-auto flex cursor-pointer items-center gap-2 rounded-[12px] bg-[#3A74D3] px-3 py-3 text-base font-medium text-white transition-colors duration-200 hover:bg-[#2a5bb0] active:bg-[#2a5bb0]"
          />
        </div>
      </div>
    </form>
  );
};

export default CustomerReport;
