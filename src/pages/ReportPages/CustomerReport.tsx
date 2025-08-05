import React, { useState } from 'react';

// Define the type for filter state
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
    refDateTo: ''
  });

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
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">Client Name</label>
            <input
              type="text"
              name="clientName"
              placeholder="Enter client name"
              value={filters.clientName}
              onChange={handleFilterChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">Model</label>
            <input
              type="text"
              name="model"
              placeholder="Enter model"
              value={filters.model}
              onChange={handleFilterChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400 transition-all"
            />
          </div>
            <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">Ref Date From</label>
            <input
              type="date"
              name="refDateFrom"
              value={filters.refDateFrom}
              onChange={handleFilterChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">Ref Date To</label>
            <input
              type="date"
              name="refDateTo"
              value={filters.refDateTo}
              onChange={handleFilterChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">Service Date</label>
            <input
              type="date"
              name="serviceDate"
              value={filters.serviceDate}
              onChange={handleFilterChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">Technician</label>
            <input
              type="text"
              name="technician"
              placeholder="Enter technician"
              value={filters.technician}
              onChange={handleFilterChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">Complaint</label>
            <input
              type="text"
              name="complaint"
              placeholder="Enter complaint"
              value={filters.complaint}
              onChange={handleFilterChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">Status</label>
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-700"
            >
              <option value="Completed">Completed</option>
              <option value="Pending">Pending</option>
            </select>
          </div>
        
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4">
        <button
          className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-all cursor-pointer duration-200"
        >
          Submit
        </button>
        <button
          className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 cursor-pointer  transition-all duration-200"
        >
        PDF
        </button>
        <button
          className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 cursor-pointer  transition-all duration-200"
        >
       Excel
        </button>
      </div>
    </div>
  );
};

export default CustomerReport;