// EmployeeList.tsx
import { useState } from "react";
import ButtonSm from "../../../components/common/Buttons";
import DropdownSelect from "../../../components/common/DropDown";
import PageHeader from "../../../components/masterPage.components/PageHeader";
import { useFetchBranchOptions } from "../../../queries/masterQueries/BranchQuery";
import { useFetchDepartmentOptions } from "../../../queries/masterQueries/DepartmentQuery";

import Input, { DateInput } from "../../../components/common/Input";
import { useNavigate } from "react-router-dom";
import { appRoutes } from "../../../routes/appRoutes";

import PaginationControls from "../../../components/common/Pagination";
import SearchBar from "../../../components/common/SearchBar";
import EmployeeTableSkeleton from "../TableSkeleton";
import { useFetchEmployeesPaginated } from "@/queries/employeeQueries/employeesQuery";
import { AnimatePresence } from "motion/react";
import { DeleteEmployeeDialogBox } from "./DeleteEmployee.component";
import DialogBox from "@/components/common/DialogBox";
import type { Employee } from "@/types/employeeApiTypes";

const ITEMS_PER_PAGE = 15;

const Employeelist = () => {
  const { data: departments } = useFetchDepartmentOptions();
  const { data: branchOptions } = useFetchBranchOptions();

  const [showFilters, setShowFilters] = useState(false);
  const [search, setSearch] = useState("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedEmployee, SetSelectedEmployee] = useState<Employee>(
    {} as Employee,
  );
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading } = useFetchEmployeesPaginated(
    currentPage - 1,
    ITEMS_PER_PAGE,
    search,
  );

  const navigate = useNavigate();
  const handleToggleFilters = () => setShowFilters((prev) => !prev);

  const paginatedData = data?.data || [];
  const totalPages = data?.totalPages || 0;

  return (
    <div className="employee-list-page flex flex-col gap-4 p-2">
      <AnimatePresence>
        {isDeleteDialogOpen && selectedEmployee.code && (
          <DialogBox setToggleDialogueBox={setIsDeleteDialogOpen}>
            <DeleteEmployeeDialogBox
              setIsDeleteEmployeeDialogOpen={setIsDeleteDialogOpen}
              employeeDetails={selectedEmployee}
            />
          </DialogBox>
        )}
      </AnimatePresence>
      <div className="relative flex flex-col gap-6 rounded-[12px] bg-[#ffff]/90 p-4">
        <button
          onClick={handleToggleFilters}
          className={`absolute right-[50%] -bottom-3 z-10 flex w-fit translate-x-1/2 cursor-pointer rounded-[5px] border border-gray-300 bg-white p-2 transition-transform duration-300 ${showFilters ? "rotate-180" : "rotate-0"}`}
        >
          <img src="/icons/arrowup.png" alt="toggle-filters" />
        </button>

        <div className="flex items-center justify-between">
          <section className="flex flex-col items-start justify-start">
            <PageHeader title="Employees" />
            <p className="w-max text-base font-medium text-slate-500">
              Manage your employees details
            </p>
          </section>

          <section className="flex w-full flex-row items-center justify-end gap-4">
            <SearchBar
              placeholder="Search by name or ID"
              className="max-w-[300px]"
              isSearchable
            />

            <ButtonSm
              onClick={(e) => {
                e.stopPropagation();
                navigate(
                  appRoutes.employeesRoute.children.staffsProfile +
                    "/" +
                    "new" +
                    "?state=create",
                );
              }}
              state="default"
              text="Add Employee"
              className="text-md py-3 text-white"
              imgUrl="/icons/plus.svg"
              iconPosition="right"
            />
            <ButtonSm
              state="default"
              text="Import"
              className="text-md py-3 text-white"
              imgUrl="/icons/ArrowDown.svg"
              iconPosition="right"
            />
          </section>
        </div>

        <div className="filters-section w-full scale-100 transform space-y-4 rounded-[12px] bg-white p-4 opacity-100 shadow-sm transition-all duration-300 ease-in-out">
          <div className="flex items-center justify-between gap-3">
            <span className="font-medium text-gray-700">Sort & filter </span>
            <div className="flex gap-3">
              <ButtonSm
                state="default"
                className="text-white"
                text="Apply filters"
              />
              <ButtonSm
                state="default"
                onClick={() => {}}
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
                    options={branchOptions ?? []}
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
                  placeholder="DD-MM-YYYY"
                />
              </div>
              <div className="w-full sm:w-[48%] lg:w-[32%]">
                <DateInput
                  title="Date of Birth"
                  value=""
                  onChange={() => {}}
                  placeholder="DD-MM-YYYY"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Table Section */}
      {isLoading ? (
        <EmployeeTableSkeleton />
      ) : (
        <div className="rounded-[12px] bg-white/80 p-4">
          <div className="mb-2 flex items-center justify-between">
            <section className="result-length flex flex-row items-center gap-2">
              <div className="h-[10px] w-[10px] rounded-full bg-blue-500"></div>
              <h2 className="text-md font-semibold text-zinc-800">
                Showing {paginatedData.length} results of{" "}
                {data?.totalRecords || 0}
              </h2>
            </section>
            <PaginationControls
              totalPages={totalPages}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
            />
          </div>

          <div className="tables mt-4 flex min-h-[300px] w-full flex-col overflow-clip rounded-[9px] bg-white shadow-sm">
            <header className="header flex w-full flex-row items-center gap-2 bg-gray-100 px-3 py-3">
              <p className="w-[60px] text-start text-sm font-semibold text-zinc-900">
                S.No
              </p>
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

            {paginatedData.length === 0 ? (
              <h2 className="text-md my-3 text-center font-medium text-zinc-600">
                No Staff Found
              </h2>
            ) : (
              paginatedData.map((item, index) => (
                <div
                  key={item.code}
                  className={`flex w-full cursor-pointer items-center gap-2 bg-white px-3 py-2 text-zinc-700 hover:bg-slate-50`}
                >
                  <p className="w-[60px] px-2 py-2 text-sm">
                    {(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                  </p>
                  <p className="w-[120px] text-sm font-normal text-slate-700">
                    {item.code}
                  </p>
                  <p className="w-[160px] text-sm font-normal text-slate-700">
                    {item.name}
                  </p>
                  <p className="w-[120px] text-sm font-normal text-slate-700">
                    {item.branch[1]}
                  </p>
                  <p className="w-[140px] text-sm font-normal text-slate-700">
                    {item.mobile1}
                  </p>
                  <p className="w-[160px] text-sm font-normal text-slate-700">
                    {item.department[1]}
                  </p>
                  <p className="w-[160px] text-sm font-normal text-slate-700">
                    {item.designation[1]}
                  </p>
                  <p className="w-[120px] text-sm font-normal text-slate-700">
                    {item.doj}
                  </p>
                  <p className="w-[100px] text-sm font-normal text-slate-700">
                    {item.shift[1]}
                  </p>
                  <p className="w-[120px] text-sm font-normal text-slate-700">
                    {item.biometricNo}
                  </p>
                  <div className="flex min-w-[120px] flex-row gap-2">
                    <ButtonSm
                      className="aspect-square"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(
                          appRoutes.employeesRoute.children.staffsProfile +
                            "/" +
                            item.code +
                            "?state=display",
                        );
                      }}
                      text=""
                      iconPosition="right"
                      imgUrl="/icons/view-icon.svg"
                      state="outline"
                    />
                    <ButtonSm
                      className="aspect-square"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(
                          appRoutes.employeesRoute.children.staffsProfile +
                            "/" +
                            item.code +
                            "?state=edit",
                        );
                      }}
                      state="outline"
                      imgUrl="/icons/edit-icon.svg"
                    />
                    <ButtonSm
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsDeleteDialogOpen(true);
                        SetSelectedEmployee(item);
                      }}
                      className="aspect-square bg-red-100 text-red-500 outline-1 outline-red-500 hover:bg-red-100 hover:text-red-500 active:bg-red-100 active:text-red-500"
                      state="default"
                      imgUrl="/icons/delete-icon.svg"
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Employeelist;
