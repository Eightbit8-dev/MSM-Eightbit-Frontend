import React, { useState } from 'react';
import { useFetchClientOptions } from "@/queries/masterQueries/ClientQuery";
import { useFetchModelsOptions } from "../../queries/masterQueries/ProductQuery";
import { useFetchServiceEngineerOptions } from "../../queries/masterQueries/ServiceEngineersQuery";
import { useFetchProblemOptions } from "../../queries/masterQueries/Problem-types";
import DropdownSelect from '@/components/common/DropDown';
import { DateInput } from "../../components/common/Input"; // Adjust path based on your structure

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
    clientName: '',
    model: '',
    serviceDate: '',
    technician: '',
    complaint: '',
    status: '',
    refDateFrom: '',
    refDateTo: '',
  });

  const { data: brandOptions = [] } = useFetchModelsOptions();
  const { data: serviceOptions = [] } = useFetchServiceEngineerOptions();
  const { data: clientOptions = [] } = useFetchClientOptions();
  const { data: problemOptions = [] } = useFetchProblemOptions();

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="container mx-auto p-6 bg-white min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Customer Report</h1>

      {/* Filter Form */}
      <div className="p-6 bg-white rounded-xl shadow-md mb-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Filter Options</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <DropdownSelect
            title="Client"
            options={clientOptions}
            selected={clientOptions.find((c) => c.label === filters.clientName) || { id: 0, label: "Select Client" }}
            onChange={(val) => setFilters({ ...filters, clientName: val.label })}
            required
          />
          <DropdownSelect
            title="Model"
            options={brandOptions}
            selected={brandOptions.find((b) => b.label === filters.model) || { id: 0, label: "Select Model" }}
            onChange={(val) => setFilters({ ...filters, model: val.label })}
            required
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
            selected={serviceOptions.find((s) => s.label === filters.technician) || { id: 0, label: "Select Technician" }}
            onChange={(val) => setFilters({ ...filters, technician: val.label })}
            required
          />
          <DropdownSelect
            title="Complaint"
            options={problemOptions}
            selected={problemOptions.find((p) => p.label === filters.complaint) || { id: 0, label: "Select Complaint" }}
            onChange={(val) => setFilters({ ...filters, complaint: val.label })}
            required
          />
          <div>
            <DropdownSelect
  title="Complaint"
  options={[
    { id: 1, label: "Completed" },
    { id: 2, label: "Not Completed" },
  ]}
  selected={
    [{ id: 1, label: "Completed" }, { id: 2, label: "Not Completed" }]
      .find((p) => p.label === filters.complaint) || { id: 0, label: "Select Complaint" }
  }
  onChange={(val) => setFilters({ ...filters, complaint: val.label })}
  required
/>

          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4">
        <button className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-all">
          Submit
        </button>
        <button className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-all">
          PDF
        </button>
        <button className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-all">
          Excel
        </button>
      </div>
    </div>
  );
};

export default CustomerReport;
