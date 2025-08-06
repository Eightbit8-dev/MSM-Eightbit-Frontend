import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";

import ButtonSm from "../../../components/common/Buttons";
import PageHeader from "../../../components/masterPage.components/PageHeader";
import DialogBox from "../../../components/common/DialogBox";
import { DeleteSpareDialogBox } from "./DeleteSpares";
import ErrorComponent from "../../../components/common/Error";
import DropdownSelect from "../../../components/common/DropDown";
import PaginationControls from "../../../components/common/Pagination";

import type { FormState } from "../../../types/appTypes";
import type { SpareDetails } from "../../../types/masterApiTypes";
import { useFetchSparesPaginated } from "../../../queries/masterQueries/SpareQuery";
import SpareEdit from "./Spares.component";
import MasterSearchBar from "@/components/common/MasterSearchBar";
import MasterTableSkeleton from "@/components/masterPage.components/LoadingSkeleton";

const SparesPage = () => {
  const [isDeleteSpareDialogOpen, setIsDeleteSpareDialogOpen] = useState(false);
  const [selectedSpare, setSelectedSpare] = useState<SpareDetails | null>(null);
  const [formState, setFormState] = useState<FormState>("create");
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [searchValue, setSearchValue] = useState("");

  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useFetchSparesPaginated(currentPage, itemsPerPage, searchValue);

  const spareList = data?.data || [];
  const totalPages = data?.totalPages || 0;

  useEffect(() => {
    if (!isLoading && spareList.length === 0 && currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  }, [spareList, isLoading]);

  const renderTableContent = () => {
    if (isLoading) return <MasterTableSkeleton  />;

    if (isError)
      return (
        <div className="flex w-full justify-center py-8">
          <ErrorComponent />
        </div>
      );

    if (spareList.length === 0)
      return (
        <div className="flex w-full justify-center py-8">
          <h2 className="text-md font-medium text-zinc-600">No Spares Found</h2>
        </div>
      );

    return spareList.map((item: SpareDetails, index: number) => {
      const isSelected = selectedSpare?.id === item.id;

      return (
        <div
          key={item.id}
          className={`cell-1 flex w-full cursor-pointer flex-row items-center gap-2 px-3 py-2 text-zinc-700 ${
            isSelected
              ? "bg-blue-100 font-semibold text-blue-800"
              : index % 2 === 0
              ? "bg-white"
              : "bg-slate-50"
          } hover:bg-slate-100 active:bg-slate-200`}
          onClick={(e) => {
            e.stopPropagation();
            if (isSelected && formState === "display") return;
            setFormState("display");
            setSelectedSpare({ ...item });
          }}
        >
          <p className="w-max min-w-[50px] px-2 py-4 text-start text-sm font-medium">
            {(currentPage - 1) * itemsPerPage + index + 1}
          </p>
          <p className="w-full text-start text-sm font-medium">{item.spareName}</p>
          <p className="w-full text-start text-sm font-medium">{item.partNumber}</p>

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
                setFormState("edit");
                setSelectedSpare({ ...item });
              }}
            />
            <ButtonSm
              className="bg-red-100 text-red-500 outline-1 outline-red-500 hover:bg-red-100 hover:text-red-500 active:bg-red-100 active:text-red-500"
              state="default"
              text="Delete"
              onClick={(e) => {
                e.stopPropagation();
                setFormState("create");
                setSelectedSpare(item);
                setIsDeleteSpareDialogOpen(true);
              }}
            />
          </div>
        </div>
      );
    });
  };

  return (
    <main className="flex w-full max-w-full flex-col gap-4 md:flex-row">
      {/* Delete Dialog */}
      <AnimatePresence>
        {isDeleteSpareDialogOpen && selectedSpare && (
          <DialogBox setToggleDialogueBox={setIsDeleteSpareDialogOpen}>
            <DeleteSpareDialogBox
              setIsDeleteSpareDialogOpen={setIsDeleteSpareDialogOpen}
              spare={selectedSpare}
              setSpare={setSelectedSpare}
              setFormState={setFormState}
            />
          </DialogBox>
        )}
      </AnimatePresence>

      {/* Table Section */}
      <section className="table-container flex w-full flex-col gap-3 rounded-[12px] bg-white/80 p-4 shadow-sm md:w-[50%]">
        <header className="flex flex-col md:flex-row  md:items-center items-start justify-between">
          <PageHeader title="Spare Configuration" />

          <footer className="mt-3 flex w-full flex-row items-center justify-between gap-2 md:mt-0 md:justify-end">
            <MasterSearchBar
              inputValue={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onClear={() => setSearchValue("")}
              onSearch={() => refetch()}
            />

            <DropdownSelect
              title=""
              direction="down"
              options={[5, 10, 15, 20].map((item) => ({
                id: item,
                label: `${item} Entries`,
              }))}
              selected={{
                id: itemsPerPage,
                label: `${itemsPerPage} Entries`,
              }}
              onChange={(e) => {
                setItemsPerPage(e.id);
                setCurrentPage(1);
              }}
            />
          </footer>
        </header>

        <div className="tables flex w-full flex-col overflow-clip rounded-[9px]">
          {/* Table Header */}
          <header className="header flex w-full flex-row items-center gap-2 bg-gray-200 px-3">
            <p className="w-max min-w-[50px] px-2 py-4 text-start text-sm font-semibold text-zinc-900">
              S.No
            </p>
            <p className="w-full text-start text-sm font-semibold text-zinc-900">
              Spare Name
            </p>
            <p className="w-full text-start text-sm font-semibold text-zinc-900">
              Part Number
            </p>
            <p className="min-w-[120px] text-start text-sm font-semibold text-zinc-900">
              Action
            </p>
          </header>

          {/* Table Content */}
          {renderTableContent()}
        </div>

        {!isLoading && !isError && spareList.length > 0 && (
          <footer className="flex w-full justify-end">
            <PaginationControls
              totalPages={totalPages}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
            />
          </footer>
        )}
      </section>

      {/* Edit/Create Form Section */}
      <section className="table-container mb-20 md:mb-0 max-h-full w-full flex-col gap-3 rounded-[12px] bg-white/80 p-4 shadow-sm md:w-[50%]">
        <SpareEdit
          spareDetails={selectedSpare}
          formState={formState}
          setFormState={setFormState}
          setSelectedSpare={setSelectedSpare}
          isImportModalOpen={isImportModalOpen}
          setIsImportModalOpen={setIsImportModalOpen}
        />
      </section>
    </main>
  );
};

export default SparesPage;
