import { useFetchMachine } from "../../../queries/masterQueries/MachineQuery";
import ButtonSm from "@/components/common/Buttons";
import PageHeader from "@/components/masterPage.components/PageHeader";
import PaginationControls from "../../../components/common/Pagination";
import EmployeeTableSkeleton from "../../TableSkleton";
import { DeleteMachineDialogBox } from "./MachineEntryDelete";

import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import type { TransactionDetails } from "@/types/transactionTypes";

const ITEMS_PER_PAGE = 10;

const MachineEntry = () => {
  const { data, isLoading } = useFetchMachine();
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMachine, setSelectedMachine] = useState<TransactionDetails | null>(null);
  const [isDeleteDialogOpen, setIsDeleteMachineDialogOpen] = useState(false);

  const paginatedData = useMemo(() => {
    if (!data) return [];
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return data.slice(start, start + ITEMS_PER_PAGE);
  }, [data, currentPage]);

  const totalPages = Math.ceil((data?.length || 0) / ITEMS_PER_PAGE);

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex justify-between items-center bg-white p-2 rounded-lg">
        <div className="flex flex-col">
          <PageHeader title="Machine Entry" />
          <p className="text-slate-500 text-sm font-medium">Manage your machine transactions</p>
        </div>
        <div className="flex items-center gap-2">
          <ButtonSm
            className="font-medium border hover:bg-white active:bg-white  border-gray-300 text-black bg-white"
            text="Generate QR"
            state="default"
            type="button"
          />
          <ButtonSm
            className="font-medium text-white"
            text="New Transaction"
            state="default"
            type="button"
            onClick={() => navigate("/transactions/machine-create")} // 👈 navigate to create page
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
                {[
                  "S.No",
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
                      label === "SL No" ? "w-[100px]"
                        : label === "Serial Number" || label === "Reference No" ? "w-[140px]"
                        : label === "Installation Date" ? "w-[140px]"
                        : label === "Installed By" ? "w-[120px]"
                        : label === "Client" ? "w-[160px]"
                        : label === "Machine Type" ? "w-[150px]"
                        : label === "Brand" ? "w-[120px]"
                        : label === "Model" ? "w-[100px]"
                        : label === "Action" ? "min-w-[120px]"
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
                    <p className="w-[60px] px-2 py-2 text-sm">
                      {(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                    </p>
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
                        className="aspect-square"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/transactions/machine-edit/${item.id}`); // 👈 edit redirect
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
                        className="aspect-square hover:bg-red-100 active:bg-red-100 bg-red-100 text-red-500"
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

      {/* Delete Dialog */}
      {isDeleteDialogOpen && selectedMachine && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="w-[90%] max-w-md rounded-lg bg-white p-4 shadow-xl">
            <DeleteMachineDialogBox
              client={selectedMachine}
              setIsDeleteMachineDialogOpen={setIsDeleteMachineDialogOpen}
              onDeleted={() => {
                setSelectedMachine(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default MachineEntry;
