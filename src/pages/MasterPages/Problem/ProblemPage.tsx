import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

import ButtonSm from "../../../components/common/Buttons";
import PageHeader from "../../../components/masterPage.components/PageHeader";
import MasterPagesSkeleton from "../../../components/masterPage.components/LoadingSkeleton";
import ErrorComponent from "../../../components/common/Error";
import DialogBox from "../../../components/common/DialogBox";
import DropdownSelect from "../../../components/common/DropDown";
import PaginationControls from "../../../components/common/Pagination";

import ProblemEdit from "./EditProblem.component";
import { DeleteProblemDialogBox } from "../../MasterPages/Problem/ProblemDialogBox";

import { useFetchProblem } from "../../../queries/masterQueries/Problem-types";
import { appRoutes } from "../../../routes/appRoutes";

import type { FormState } from "../../../types/appTypes";
import type { ProblemDetails } from "../../../types/masterApiTypes";

const ProblemPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!Cookies.get("token")) {
      navigate(appRoutes.signInPage);
    }
  }, [navigate]);

  const [isDeleteProblemDialogOpen, setIsDeleteProblemDialogOpen] = useState(false);
  const [problem, setProblem] = useState<ProblemDetails | null>(null);
  const [formState, setFormState] = useState<FormState>("create");

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const { data, isLoading, isError } = useFetchProblem(currentPage, itemsPerPage);

  const problemList = data?.data || [];
  const totalPages = data?.totalPages || 0;
  const totalRecords = data?.totalRecords || 0;

  const handleProblemDeleted = () => {
    setProblem(null);
    setFormState("create");
  };

  if (isLoading) return <MasterPagesSkeleton />;
  if (isError) return <ErrorComponent />;

  return (
    <>
      <main className="flex w-full max-w-full flex-col gap-4 md:flex-row">
        {/* Table Section */}
        <section className="table-container flex w-full flex-col gap-3 rounded-[12px] bg-white/80 p-4 shadow-sm md:w-[50%]">
          <header className="flex flex-row items-center justify-between">
            <PageHeader title="Problem Configuration" />
          </header>

          <div className="tables flex w-full flex-col overflow-clip rounded-[9px]">
            <header className="header flex w-full flex-row items-center gap-2 bg-gray-200 px-3">
              <p className="w-max min-w-[100px] px-2 py-4 text-start text-sm font-semibold text-zinc-900">
                S.No
              </p>
              <p className="w-full text-start text-sm font-semibold text-zinc-900">Name</p>
              <p className="w-full text-start text-sm font-semibold text-zinc-900">Max-Eligible Amount</p>
              <p className="min-w-[120px] text-start text-sm font-semibold text-zinc-900">Action</p>
            </header>

            {problemList.length === 0 ? (
              <h2 className="text-md my-3 text-center font-medium text-zinc-600">No Problems Found</h2>
            ) : (
              problemList.map((item, index) => {
                const isSelected = problem?.id === item.id;

                return (
                  <div
                    key={item.id}
                    className={`cell-1 flex w-full cursor-pointer flex-row items-center gap-2 px-3 py-2 text-zinc-700 ${
                      isSelected
                        ? "bg-gray-100"
                        : index % 2 === 0
                        ? "bg-white"
                        : "bg-slate-50"
                    } hover:bg-slate-100 active:bg-slate-200`}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (isSelected && formState === "display") return;
                      setProblem(item);
                      setFormState("display");
                    }}
                  >
                    <p className="w-max min-w-[100px] px-2 py-4 text-start text-sm font-medium">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </p>
                    <p className="w-full text-start text-sm font-medium">{item.problemType}</p>
                    <p className="w-full text-start text-sm font-medium">{item.description}</p>

                    <div className="flex min-w-[120px] flex-row gap-2 text-start text-sm font-medium">
                      <ButtonSm
                        className={`${
                          formState === "edit" && isSelected
                            ? "!hover:bg-blue-500 !hover:text-black !active:bg-blue-600 !bg-blue-500 !text-white"
                            : "bg-white"
                        }`}
                        state="outline"
                        text="Edit"
                        onClick={(e) => {
                          e.stopPropagation();
                          setProblem(item);
                          setFormState("edit");
                        }}
                      />
                      <ButtonSm
                        className="bg-red-100 text-red-500 outline-1 outline-red-500 hover:bg-red-100 hover:text-red-500 active:bg-red-100 active:text-red-500"
                        state="default"
                        text="Delete"
                        onClick={(e) => {
                          e.stopPropagation();
                          setProblem(item);
                          setIsDeleteProblemDialogOpen(true);
                        }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer with Pagination */}
          <footer className="mt-2 flex w-full flex-row items-center justify-between">
            <DropdownSelect
              title=""
              direction="up"
              options={[5, 10, 15, 20].map((item) => ({
                id: item,
                label: `${item} items per page`,
              }))}
              selected={{
                id: itemsPerPage,
                label: `${itemsPerPage} items per page`,
              }}
              onChange={(e) => {
                setItemsPerPage(e.id);
                setCurrentPage(1);
              }}
            />
            <PaginationControls
              totalPages={totalPages}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
            />
          </footer>
        </section>

        {/* Edit/Create Section */}
        <section className="table-container max-h-full w-full flex-col gap-3 rounded-[12px] bg-white/80 p-4 shadow-sm md:w-[50%]">
          <ProblemEdit
            problemDetails={problem}
            formState={formState}
            setFormState={setFormState}
            setProblemData={setProblem}
          />
        </section>
      </main>

      {/* Delete Dialog */}
      {isDeleteProblemDialogOpen && problem && (
        <DialogBox setToggleDialogueBox={setIsDeleteProblemDialogOpen}>
          <DeleteProblemDialogBox
            problem={problem}
            onDeleted={handleProblemDeleted}
            setIsDeleteProblemDialogOpen={setIsDeleteProblemDialogOpen}
          />
        </DialogBox>
      )}
    </>
  );
};

export default ProblemPage;
