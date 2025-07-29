import {
  useCreateMachineQR,
  useFetchMachine,
} from "../../../queries/masterQueries/MachineQuery";
import ButtonSm from "@/components/common/Buttons";
import PageHeader from "@/components/masterPage.components/PageHeader";
import PaginationControls from "../../../components/common/Pagination";
import EmployeeTableSkeleton from "../../TableSkleton";
import { DeleteMachineDialogBox } from "./MachineEntryDelete";

import { useState, useMemo } from "react";
import type { MachineDetails } from "@/types/transactionTypes";
import MachineFormPage from "./MachineForm";
import DialogBox from "@/components/common/DialogBox";
import { AnimatePresence } from "motion/react";
import CheckboxInput from "@/components/common/CheckBox";
import type { FormState } from "@/types/appTypes";
import { convertToFrontendDate } from "@/utils/commonUtils";

const ITEMS_PER_PAGE = 10;

const MachineEntry = () => {
  const { data, isLoading } = useFetchMachine();
  const { mutate: generateQR, isPending: isCreateQRPending } =
    useCreateMachineQR();

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMachine, setSelectedMachine] = useState<MachineDetails | null>(
    null,
  );
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [isDeleteDialogOpen, setIsDeleteMachineDialogOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formState, setFormState] = useState<FormState>("create");

  const paginatedData = useMemo(() => {
    if (!data) return [];
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return data.slice(start, start + ITEMS_PER_PAGE);
  }, [data, currentPage]);

  const totalPages = Math.ceil((data?.length || 0) / ITEMS_PER_PAGE);

  const handleCheckboxChange = (id: number) => {
    setSelectedIds((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((selectedId) => selectedId !== id)
        : [...prevSelected, id],
    );
  };

  const allIdsOnPage = paginatedData.map((m) => m.id);
  const isAllSelected = allIdsOnPage.every((id) => selectedIds.includes(id));

  const handleSelectAllChange = () => {
    setSelectedIds((prev) =>
      isAllSelected
        ? prev.filter((id) => !allIdsOnPage.includes(id))
        : [...new Set([...prev, ...allIdsOnPage])],
    );
  };

  const dummyData: MachineDetails = {
    id: 0,
    slNo: "",
    serialNumber: "",
    referenceNumber: "",
    installationDate: convertToFrontendDate(
      new Date().toISOString().split("T")[0],
    ),
    installedBy: "",
    machinePhotos: [],
    clientName: "",
    machineType: "",
    brand: "",
    modelNumber: "",
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between rounded-lg bg-white p-2">
        <div className="flex flex-col">
          <PageHeader title="Machine Entry" />
          <p className="text-sm font-medium text-slate-500">
            Manage your Machine entries
          </p>
        </div>
        <div className="flex items-center gap-2">
          <ButtonSm
            disabled={selectedIds.length === 0 || isCreateQRPending}
            className={
              selectedIds.length > 0 ? "text-white" : "disabled:opacity-60"
            }
            text={isCreateQRPending ? "Generating QR" : "Generate QR"}
            state={selectedIds.length > 0 ? "default" : "outline"}
            type="button"
            onClick={() => {
              generateQR(selectedIds);
            }}
          />
          <ButtonSm
            className="font-medium text-white"
            text="New Entry"
            state="default"
            type="button"
            onClick={() => {
              setSelectedMachine(dummyData);
              setFormState("create");
              setIsFormOpen(true);
            }}
            iconPosition="right"
            imgUrl="/icons/plus-icon.svg"
          />
          <ButtonSm
            className="font-medium text-white"
            text="Import"
            state="default"
            type="button"
            iconPosition="right"
            imgUrl="/icons/ArrowDown.svg"
          />
        </div>
      </div>

      {/* Table */}
      <div>
        {isLoading ? (
          <EmployeeTableSkeleton />
        ) : (
          <div className="rounded-[12px] bg-white/80 p-4">
            <div className="mb-2 flex items-center justify-between">
              <section className="result-length flex flex-row items-center gap-2">
                <div className="h-[10px] w-[10px] rounded-full bg-blue-500"></div>
                <h2 className="text-md font-semibold text-zinc-800">
                  Showing {paginatedData.length} results of {data?.length || 0}
                </h2>
              </section>
              <PaginationControls
                totalPages={totalPages}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
              />
            </div>

            <div className="tables mt-4 flex min-h-[300px] w-full flex-col overflow-clip rounded-[9px] bg-white shadow-sm">
              {/* Table Header */}
              <header className="header flex w-full flex-row items-center gap-2 bg-gray-100 px-3 py-3">
                <div className="flex w-[100px] items-center gap-2">
                  <p className="w-[40px] text-sm font-semibold text-zinc-900">
                    S.No
                  </p>
                  <CheckboxInput
                    checked={isAllSelected}
                    onChange={handleSelectAllChange}
                    label=""
                  />
                </div>
                {[
                  "SL No",
                  "Serial Number",
                  "Reference No",
                  "Installation Date",
                  "Installed By",
                  "Client",
                  "Machine Type",
                  "Brand",
                  "Model",
                  "Action",
                ].map((label, index) => (
                  <p
                    key={index}
                    className={`text-start text-sm font-semibold text-zinc-900 ${
                      label === "SL No"
                        ? "w-[100px]"
                        : label === "Serial Number" || label === "Reference No"
                          ? "w-[140px]"
                          : label === "Installation Date"
                            ? "w-[140px]"
                            : label === "Installed By"
                              ? "w-[120px]"
                              : label === "Client"
                                ? "w-[160px]"
                                : label === "Machine Type"
                                  ? "w-[150px]"
                                  : label === "Brand"
                                    ? "w-[120px]"
                                    : label === "Model"
                                      ? "w-[100px]"
                                      : label === "Action"
                                        ? "min-w-[120px]"
                                        : "w-[60px]"
                    }`}
                  >
                    {label}
                  </p>
                ))}
              </header>

              {/* Table Body */}
              {paginatedData.length === 0 ? (
                <h2 className="text-md my-3 text-center font-medium text-zinc-600">
                  No Machines Found
                </h2>
              ) : (
                paginatedData.map((item, index) => (
                  <div
                    key={item.slNo}
                    className="flex w-full cursor-pointer items-center gap-2 bg-white px-3 py-2 text-zinc-700 hover:bg-slate-50"
                  >
                    <div className="flex w-[100px] flex-row items-center gap-1">
                      <p className="w-[40px] text-sm">
                        {(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                      </p>
                      <CheckboxInput
                        checked={selectedIds.includes(item.id)}
                        onChange={() => handleCheckboxChange(item.id)}
                        label=""
                      />
                    </div>

                    <p className="w-[100px] text-sm">{item.slNo}</p>
                    <p className="w-[140px] text-sm">{item.serialNumber}</p>
                    <p className="w-[140px] text-sm">{item.referenceNumber}</p>
                    <p className="w-[140px] text-sm">{item.installationDate}</p>
                    <p className="w-[120px] text-sm">{item.installedBy}</p>
                    <p className="w-[160px] text-sm">{item.clientName}</p>
                    <p className="w-[120px] text-sm">{item.machineType}</p>
                    <p className="w-[120px] text-sm">{item.brand}</p>
                    <p className="w-[100px] text-sm">{item.modelNumber}</p>
                    <div className="flex min-w-[120px] flex-row gap-2">
                      <ButtonSm
                        className="aspect-square scale-90 border-1 border-blue-500 bg-blue-200"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedMachine(item);
                          setFormState("edit");
                          setIsFormOpen(true);
                        }}
                        state="outline"
                        imgUrl="/icons/edit-icon.svg"
                      />
                      <ButtonSm
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedMachine(item);
                          setIsDeleteMachineDialogOpen(true);
                        }}
                        className="aspect-square scale-90 border-1 border-red-500 bg-red-100 text-red-500 hover:bg-red-100 active:bg-red-100"
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

      <AnimatePresence>
        {isDeleteDialogOpen && selectedMachine && (
          <DialogBox
            setToggleDialogueBox={setIsFormOpen}
            className="lg:min-w-[400px]"
          >
            <DeleteMachineDialogBox
              client={selectedMachine}
              setIsDeleteMachineDialogOpen={setIsDeleteMachineDialogOpen}
              onDeleted={() => {
                setSelectedMachine(null);
              }}
            />
          </DialogBox>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {isFormOpen && selectedMachine && (
          <DialogBox
            setToggleDialogueBox={setIsFormOpen}
            className="lg:min-w-[800px]"
          >
            <MachineFormPage
              mode={formState}
              machineFromParent={selectedMachine}
              setFormVisible={setIsFormOpen}
            />
          </DialogBox>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MachineEntry;
