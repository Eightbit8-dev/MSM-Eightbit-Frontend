import {
  useCreateMachineQR,
  useFetchMachine,
} from "../../../queries/TranscationQueries/MachineQuery";
import ButtonSm from "@/components/common/Buttons";
import PageHeader from "@/components/masterPage.components/PageHeader";
import PaginationControls from "../../../components/common/Pagination";
import EmployeeTableSkeleton from "../../TableSkleton";
import { DeleteMachineDialogBox } from "./MachineEntryDelete.Dialog";

import { useState } from "react";
import type { MachineDetails } from "@/types/transactionTypes";
import MachineFormPage from "./MachineForm";
import DialogBox from "@/components/common/DialogBox";
import { AnimatePresence } from "motion/react";
import CheckboxInput from "@/components/common/CheckBox";
import type { FormState } from "@/types/appTypes";
import { convertToFrontendDate } from "@/utils/commonUtils";
import DropdownSelect from "@/components/common/DropDown";
import { useBreakpoints } from "@/hooks/useBreakPoints";

const MachineEntry = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [selectedMachine, setSelectedMachine] = useState<MachineDetails | null>(
    null,
  );
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [isDeleteDialogOpen, setIsDeleteMachineDialogOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formState, setFormState] = useState<FormState>("create");

  const { isSm } = useBreakpoints();

  const { data, isLoading } = useFetchMachine(currentPage, itemsPerPage);

  const { mutate: generateQR, isPending: isCreateQRPending } =
    useCreateMachineQR();

  const paginatedData = data?.data || [];
  const totalPages = data?.totalPages || 0;

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

  const dummyMachineData: MachineDetails = {
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
    <div className="mb-32 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between rounded-lg bg-white p-3">
        <div className="flex flex-col">
          <PageHeader title="Machine Entry" />
          <p className="text-sm font-medium text-slate-500">
            Manage your Machine Entries
          </p>
        </div>
        <div className="flex flex-row items-center gap-2">
          <ButtonSm
            disabled={selectedIds.length === 0 || isCreateQRPending}
            className={`${
              selectedIds.length > 0 ? "text-white" : "disabled:opacity-60"
            } min-h-full self-stretch font-medium`}
            text={isCreateQRPending ? "Generating QR" : "Generate QR"}
            state={selectedIds.length > 0 ? "default" : "outline"}
            type="button"
            onClick={() => {
              generateQR(selectedIds);
            }}
          />
          <ButtonSm
            className="font-medium text-white"
            text={"New Entry"}
            state="default"
            type="button"
            onClick={() => {
              setSelectedMachine(dummyMachineData);
              setFormState("create");
              setIsFormOpen(true);
            }}
            iconPosition="right"
            imgUrl="/icons/plus-icon.svg"
          />
          <ButtonSm
            className="font-medium text-white opacity-100"
            text={isSm ? "" : "Import"}
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
          <div className="flex flex-col items-start justify-start gap-2 overflow-clip rounded-[12px] bg-white/80 p-4">
            <div className="flex w-full items-center justify-between">
              <section className="result-length flex w-full flex-row items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="flex h-[10px] w-[10px] rounded-full bg-blue-500"></div>
                  <h2 className="text-md font-semibold text-zinc-800">
                    Showing {paginatedData.length} results of{" "}
                    {data?.totalRecords || 0}
                  </h2>
                </div>

                <div className="flex items-center gap-2">
                  <div
                    className={`selectin-container flex flex-row gap-2 rounded-md border-1 border-blue-500 bg-blue-500/10 px-3 py-2 ${selectedIds.length === 0 ? "opacity-0" : ""}`}
                  >
                    <h3 className="text-md font-medium text-blue-500">
                      Selected {selectedIds.length}
                    </h3>
                    <img
                      className="cursor-pointer transition-all duration-200 hover:scale-125 hover:scale-3d"
                      onClick={() => setSelectedIds([])}
                      src="/icons/chip-x-icon.svg"
                      alt="x"
                    />
                  </div>
                  <div>
                    <PaginationControls
                      totalPages={totalPages}
                      currentPage={currentPage}
                      onPageChange={setCurrentPage}
                    />
                  </div>
                </div>
              </section>
              {/* ------selected------ */}
            </div>

            <div className="tables flex min-h-[300px] w-full flex-col overflow-x-auto rounded-[9px] bg-white shadow-sm">
              <div className="flex min-w-full flex-col">
                {/* ------Table Header------- */}
                <header className="flex flex-row items-center gap-2 bg-slate-200 px-3 py-3">
                  {/* S.No + Checkbox */}
                  <div className="flex w-[70px] min-w-[70px] items-center justify-start gap-2">
                    <p className="w-[40px] text-sm font-semibold text-zinc-900">
                      S.No
                    </p>
                    <CheckboxInput
                      checked={isAllSelected}
                      onChange={handleSelectAllChange}
                      label=""
                    />
                  </div>

                  {/* Column Headers */}
                  <div className="flex w-full flex-row gap-2">
                    {[
                      "Reference No",
                      "Machine S No",
                      "Installation Date",
                      "Installed By",
                      "Client",
                      "Machine Type",
                      "Brand",
                      "Model",
                    ].map((label, index) => (
                      <p
                        key={index}
                        className="min-w-[70px] flex-1 text-sm font-semibold text-zinc-900"
                      >
                        {label}
                      </p>
                    ))}

                    {/* Action Header */}
                    <p className="min-w-[100px] text-sm font-semibold text-zinc-900">
                      Action
                    </p>
                  </div>
                </header>

                {/* ------Table Body------ */}
                {paginatedData.length === 0 ? (
                  <h2 className="text-md my-auto text-center font-medium text-zinc-600">
                    No Entries Found
                  </h2>
                ) : (
                  paginatedData.map((item, index) => (
                    <div
                      key={item.id}
                      className="flex min-w-full flex-row items-start gap-2 border-t px-3 py-2 text-sm text-zinc-700 hover:bg-slate-50"
                    >
                      {/* S.No + Checkbox */}
                      <div className="flex w-[70px] min-w-[70px] items-center justify-start gap-2 pt-1">
                        <p className="w-[40px]">
                          {(currentPage - 1) * itemsPerPage + index + 1}
                        </p>
                        <CheckboxInput
                          checked={selectedIds.includes(item.id)}
                          onChange={() => handleCheckboxChange(item.id)}
                          label=""
                        />
                      </div>

                      {/* Row Data */}
                      <div className="flex w-full flex-row gap-2">
                        {[
                          item.referenceNumber,
                          item.serialNumber,
                          item.installationDate,
                          item.installedBy,
                          item.clientName,
                          item.machineType,
                          item.brand,
                          item.modelNumber,
                        ].map((val, idx) => (
                          <p
                            key={idx}
                            className="min-w-[70px] flex-1 pt-1 break-words"
                          >
                            {val || "—"}
                          </p>
                        ))}

                        {/* Action Buttons */}
                        <div className="flex min-w-[100px] items-center justify-start gap-2 pt-1">
                          <ButtonSm
                            className="aspect-square scale-90 border-1 border-blue-500 bg-blue-500/10"
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
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* --------- Table Footer -------- */}
            <footer className="flex w-full flex-row items-center justify-between">
              <DropdownSelect
                title=""
                direction="up"
                options={[5, 10, 15, 20].map((item) => ({
                  id: item,
                  label: item.toString(),
                }))}
                selected={{
                  id: itemsPerPage,
                  label: itemsPerPage.toString() + " items Per Page",
                }}
                onChange={(e) => {
                  setItemsPerPage(e.id);
                  setCurrentPage(1);
                }}
              />
            </footer>
          </div>
        )}
      </div>

      <AnimatePresence>
        {isDeleteDialogOpen && selectedMachine && (
          <DialogBox
            setToggleDialogueBox={setIsFormOpen}
            className="lg:min-w-[600px]"
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
