import { useState } from "react";
import { AnimatePresence } from "framer-motion";

import PageHeader from "@/components/masterPage.components/PageHeader";
import MasterPagesSkeleton from "@/components/masterPage.components/LoadingSkeleton";
import DialogBox from "@/components/common/DialogBox";
import ButtonSm from "@/components/common/Buttons";
import ErrorComponent from "@/components/common/Error";

import type { EmployeeResignation } from "@/types/employeeApiTypes";
import type { FormState } from "@/types/appTypes";
import { useFetchAllEmployeeResignations } from "@/queries/employeeQueries/employeeResignatinQuery";
import ResignationEdit from "./EditEmployeeResignation.component";
import DeleteEmployeeResignationDialogBox from "./DeleteEmployeeResignation";

const EmployeeResignationPage = () => {
  const [formState, setFormState] = useState<FormState>("create");
  const [resignation, setResignation] = useState<EmployeeResignation | null>(
    null,
  );
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const {
    data: resignations,
    isLoading,
    isError,
  } = useFetchAllEmployeeResignations();

  if (isLoading) return <MasterPagesSkeleton />;
  if (isError) return <ErrorComponent />;

  const handleRowClick = (item: EmployeeResignation) => {
    setResignation(item);
    setFormState("display");
  };

  const handleEdit = (item: EmployeeResignation) => {
    setResignation(item);
    setFormState("edit");
  };

  const handleDelete = (item: EmployeeResignation) => {
    setResignation(item);
    setIsDeleteDialogOpen(true);
  };

  return (
    <main className="flex w-full max-w-full flex-col gap-4 md:flex-row">
      <AnimatePresence>
        {isDeleteDialogOpen && resignation && (
          <DialogBox setToggleDialogueBox={setIsDeleteDialogOpen}>
            <DeleteEmployeeResignationDialogBox
              resignation={resignation}
              setResignationData={setResignation}
              setIsDeleteDialogOpen={setIsDeleteDialogOpen}
            />
          </DialogBox>
        )}
      </AnimatePresence>

      {/* Left Table Section */}
      <section className="table-container flex w-full flex-col gap-3 rounded-[12px] bg-white/80 p-4 shadow-sm md:w-[50%]">
        <header className="flex h-max flex-row items-center justify-between">
          <PageHeader title="Employee Resignation List" />
        </header>

        <div className="tables flex w-full flex-col overflow-clip rounded-[9px]">
          {/* Table Header */}
          <header className="header flex w-full flex-row items-center gap-2 bg-gray-200 px-3">
            <p className="w-[60px] px-2 py-4 text-start text-sm font-semibold text-zinc-900">
              S.No
            </p>
            <p className="w-[250px] text-start text-sm font-semibold text-zinc-900">
              Employee Code
            </p>
            <p className="w-full text-start text-sm font-semibold text-zinc-900">
              Status
            </p>
            <p className="min-w-[120px] text-start text-sm font-semibold text-zinc-900">
              Action
            </p>
          </header>

          {/* No Data */}
          {resignations?.length === 0 && (
            <h2 className="text-md my-3 text-center font-medium text-zinc-600">
              No Resignation Found
            </h2>
          )}

          {/* Table Rows */}
          {resignations?.map((item: EmployeeResignation, index: number) => {
            const isSelected = resignation?.refNo === item.refNo;
            return (
              <div
                key={item.refNo}
                className={`cell-1 flex w-full cursor-pointer flex-row items-center gap-2 px-3 py-2 text-zinc-700 ${
                  isSelected
                    ? "bg-gray-100"
                    : index % 2 === 0
                      ? "bg-white"
                      : "bg-slate-50"
                } hover:bg-slate-100 active:bg-slate-200`}
                onClick={() => handleRowClick(item)}
              >
                <p className="w-[60px] px-2 py-4 text-sm font-medium">
                  {index + 1}
                </p>
                <p className="w-[250px] text-sm font-medium">
                  {item.employeeCode}
                </p>
                <p className="w-full text-sm font-medium">
                  {item.resignationStatus}
                </p>

                <div className="flex min-w-[120px] gap-2">
                  <ButtonSm
                    className={`${
                      formState === "edit" && isSelected
                        ? "!bg-blue-500 !text-white"
                        : "bg-white"
                    }`}
                    state="outline"
                    text="Edit"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(item);
                    }}
                  />
                  <ButtonSm
                    className="bg-red-100 text-red-500 outline-1 outline-red-500 hover:bg-red-100"
                    state="default"
                    text="Delete"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(item);
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Right Edit/Create Form Section */}
      <section className="table-container max-h-full w-full flex-col gap-3 rounded-[12px] bg-white/80 p-4 shadow-sm md:w-[50%]">
        <ResignationEdit
          resignation={resignation}
          setResignationData={setResignation}
          formState={formState}
          setFormState={setFormState}
        />
      </section>
    </main>
  );
};

export default EmployeeResignationPage;
