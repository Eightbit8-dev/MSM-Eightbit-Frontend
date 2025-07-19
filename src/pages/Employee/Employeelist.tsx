// EmployeeList.tsx
import { useEffect, useState } from "react";
import ButtonSm, { ButtonLg } from "../../components/common/Buttons";
import DropdownSelect from "../../components/common/DropDown";
import SearchBar from "../../components/common/SearchBar";
import PageHeader from "../../components/masterPage.components/PageHeader";
import { useFetchBranchOptions } from "../../queries/BranchQuery";
import { staffData as fullStaffData } from "../../utils/Profiledata";
import Input, { DateInput } from "../../components/common/Input";
import { useFetchDepartmentOptions } from "../../queries/DepartmentQuery";

const ITEMS_PER_PAGE = 5;

const Employeelist = () => {
  const { data: departments } = useFetchDepartmentOptions();
  const { data: branchOptions } = useFetchBranchOptions();
  const [showFilters, setShowFilters] = useState(false);

  const [filteredData, setFilteredData] = useState(fullStaffData);
  const [currentPage, setCurrentPage] = useState(1);

  const handleToggleFilters = () => setShowFilters((prev) => !prev);
useEffect(() => {
  const newTotalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  if (currentPage > newTotalPages) {
    setCurrentPage(newTotalPages || 1); // fallback to 1 if 0
  }
}, [filteredData, currentPage]);



  const paginatedData = filteredData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );
  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);

  return (
    <div className="employee-list-page flex flex-col gap-4 p-2">
      <div className="flex flex-col relative p-4 rounded-[12px]  gap-6 bg-[#ffff]/90">
        <button
          onClick={handleToggleFilters}
          className={`flex border bg-white cursor-pointer border-gray-300 p-2 rounded-[5px] w-fit absolute -bottom-3 right-[50%] translate-x-1/2 z-10 transition-transform duration-300 ${showFilters ? "rotate-180" : "rotate-0"}`}
        >
          <img src="/icons/arrowup.png" alt="toggle-filters" />
        </button>

        <div className="flex items-center justify-between">
          <div className="flex flex-col justify-start items-start">
            <PageHeader title="Employees" />
            <p className="text-slate-500 text-base font-medium">
              Manage your employees details
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <SearchBar />
            <div className="flex gap-3">
<ButtonSm
  state="default"
  text="Add Employee"
  className="text-white"
  imgUrl="/icons/plus.svg"            // Replace with your actual path
  iconPosition="right"               // Optional, left is default
/>

<ButtonSm
  state="default"
  text="Import"
  className="text-white"
  imgUrl="/icons/ArrowDown.svg"        // Replace with your actual path
  iconPosition="right"              // Icon on right side
/>

            </div>
          </div>
        </div>


          <div
          onClick={handleToggleFilters} 
            style={{ boxShadow: "0px 0px 6.3px rgba(0, 0, 0, 0.08)" }}
className="filters-section w-full space-y-4 bg-white p-4 rounded-[12px] transform transition-all duration-300 ease-in-out opacity-100 scale-100"

          >
            <div className="flex items-center justify-between gap-3">
              <span className="font-medium text-gray-700">Sort & filter </span>
              <div className="flex gap-3">
                <ButtonSm state="default" className="text-white" text="Apply filters"/>
                <ButtonSm
                  state="default"
                  onClick={() => {
                      
                  }}
                  className="bg-red-100 text-red-500 outline-1 outline-red-500 hover:bg-red-100 hover:text-red-500 active:bg-red-100 active:text-red-500"
                  text="Clear filters"
                />
              </div>
            </div>
        {showFilters && (
            <div className="flex w-full flex-wrap gap-4">
              {[
                "Branch",
                "Department",
                "Designation",
                "Staff",
                "Employee Type",
                "Gender",
                "Blood Group",
              ].map((label, idx) => (
                <div key={idx} className="w-full sm:w-[48%] lg:w-[32%]">
                  <DropdownSelect
                    title={label}
                    options={branchOptions ?? []} // Replace with actual options
                    selected={{ id: 0, label: `Select ${label.toLowerCase()}` }}
                    onChange={() => {}}
                  />
                </div>
              ))}

              <div className="w-full sm:w-[48%] lg:w-[32%]">
                <DropdownSelect
                  title="Status"
                  options={[
                    { id: 0, label: "All" },
                    { id: 1, label: "Probation" },
                    { id: 2, label: "Confirmed" },
                    { id: 3, label: "Wait for Document" },
                  ]}
                  selected={{ id: 0, label: "Select status" }}
                  onChange={() => {}}
                />
              </div>

              <div className="w-full sm:w-[48%] lg:w-[32%]">
                <Input<number>
                  title="Biometric ID"
                  inputValue={0}
                  onChange={() => {}}
                  type="num"
                />
              </div>

              <div className="w-full sm:w-[48%] lg:w-[32%]">
                <Input<number>
                  title="Mobile"
                  inputValue={0}
                  onChange={() => {}}
                  type="num"
                  prefixText="+91"
                  max={9999999999}
                />
              </div>

              <div className="w-full sm:w-[48%] lg:w-[32%]">
                <DropdownSelect
                  title="Face Data"
                  options={[
                    { id: 0, label: "All" },
                    { id: 1, label: "yes" },
                    { id: 2, label: "no" },
                  ]}
                  selected={{ id: 0, label: "Select status" }}
                  onChange={() => {}}
                />
              </div>

              <div className="w-full sm:w-[48%] lg:w-[32%]">
                <Input<string>
                  title="Reference"
                  inputValue=""
                  onChange={() => {}}
                  type="str"
                />
              </div>

              <div className="w-full sm:w-[48%] lg:w-[32%]">
  <DateInput
    title="Date of Birth"
    value=""
    onChange={() => {}}
    placeholder="YYYY-MM-DD"
  />

              </div>

              <div className="w-full sm:w-[48%] lg:w-[32%]">
  <DateInput
    title="Date of Birth"
    value=""
    onChange={() => {}}
    placeholder="YYYY-MM-DD"
  />

              </div>
            </div>
    
        )}
      </div>
      </div>
      {/* Table Section */}
      <div className="bg-white rounded-[12px] p-4">
<div className="flex mb-2 items-center justify-between">
  <h2 className="text-lg font-semibold text-zinc-800">
    Showing {paginatedData.length} results of {filteredData.length}
  </h2>

  <div className="flex items-center gap-2">
    {/* Prev Button */}
    <button
      onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
      disabled={currentPage === 1}
      className={`px-3 py-1 rounded cursor-pointer transition 
        ${
          currentPage === 1
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : "text-gray-600 hover:bg-gray-200"
        }`}
    >
      Prev
    </button>

    {/* Page Numbers */}
    {[...Array(totalPages).keys()].map((n) => (
      <button
        key={n + 1}
        onClick={() => setCurrentPage(n + 1)}
        className={`px-3 py-1 rounded transition ${
          currentPage === n + 1
            ? "bg-blue-500 text-white"
            : "bg-gray-100 hover:bg-gray-200 text-gray-700"
        }`}
      >
        {n + 1}
      </button>
    ))}

    {/* Next Button */}
    <button
      onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
      disabled={currentPage === totalPages}
      className={`px-3 py-1 rounded cursor-pointer transition 
        ${
          currentPage === totalPages
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : "text-gray-600 hover:bg-gray-200"
        }`}
    >
      Next
    </button>
  </div>
</div>


<div className="tables flex w-full flex-col overflow-clip rounded-[9px]">
  <header className="header flex w-full flex-row py-3 items-center gap-2 bg-gray-200 px-3">
    <p className="text-start text-sm font-semibold text-zinc-900 w-[60px]">S.No</p>
    {[
      "Staff No",
      "Name",
      "Branch",
      "Mobile No",
      "Department",
      "Designation",
      "DOJ",
      "Shift",
      "Biometric",
      "Action",
    ].map((label, index) => (
      <p
        key={index}
        className={`text-start text-sm font-semibold text-zinc-900 ${
          label === "Name"
            ? "w-[160px]"
            : label === "Mobile No"
            ? "w-[140px]"
            : label === "Department" || label === "Designation"
            ? "w-[160px]"
            : label === "DOJ"
            ? "w-[120px]"
            : label === "Shift"
            ? "w-[100px]"
            : label === "Biometric"
            ? "w-[120px]"
            : label === "Action"
            ? "min-w-[120px]"
            : "w-[120px]"
        }`}
      >
        {label}
      </p>
    ))}
  </header>

  {paginatedData.length === 0 && (
    <h2 className="text-md my-3 text-center font-medium text-zinc-600">
      No Staff Found
    </h2>
  )}

  {paginatedData.map((item, index) => (
    <div
      key={item.StaffNo}
      className={`flex w-full items-center gap-2 px-3 py-2 text-zinc-700 ${
        index % 2 === 0 ? "bg-white" : "bg-slate-50"
      } hover:bg-slate-100`}
    >
      <p className="w-[60px] px-2 py-2 text-sm">
        {(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
      </p>
      <p className="w-[120px] text-sm">{item.StaffNo}</p>
      <p className="w-[160px] text-sm">{item.Name}</p>
      <p className="w-[120px] text-sm">{item.Branch}</p>
      <p className="w-[140px] text-sm">{item.MobileNo}</p>
      <p className="w-[160px] text-sm">{item.Department}</p>
      <p className="w-[160px] text-sm">{item.Designation}</p>
      <p className="w-[120px] text-sm">{item.DOJ}</p>
      <p className="w-[100px] text-sm">{item.CurrentShift}</p>
      <p className="w-[120px] text-sm">{item.BiometricNo}</p>
      <div className="flex min-w-[120px] flex-row gap-2">
        <ButtonSm text="Edit" state="outline" />
        <ButtonSm text="Delete" className="bg-red-100 text-red-500 outline-1 outline-red-500 hover:bg-red-100 hover:text-red-500 active:bg-red-100 active:text-red-500" state="default" />
      </div>
    </div>
  ))}
</div>

      </div>
    </div>
  );
};

export default Employeelist;