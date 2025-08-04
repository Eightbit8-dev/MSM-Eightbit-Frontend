import ButtonSm from "@/components/common/Buttons";
import PageHeader from "@/components/masterPage.components/PageHeader";
import PaginationControls from "../../../components/common/Pagination";
import EmployeeTableSkeleton from "../../TableSkleton";
import DropdownSelect from "@/components/common/DropDown";
import DialogBox from "@/components/common/DialogBox";
import { AnimatePresence } from "motion/react";

import { useState } from "react";
import { useFetchEntry } from "@/queries/TranscationQueries/ServiceEntryQuery";
import { DeleteEntryDialogBox } from "./ServiceEntryDelete.Dialog"; // <- your dialog file
import type { ServiceEntryData } from "@/types/transactionTypes";
import { useNavigate } from "react-router-dom";
import ServiceEntryDisplay from "./ServiceEntry.view";

const ServiceEntryPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const [selectedEntry, setSelectedEntry] = useState<ServiceEntryData | null>(
    null,
  );
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewFormOpen, setIsViewFormOpen] = useState(false);

  const { data, isLoading } = useFetchEntry(currentPage, itemsPerPage);

  const paginatedData = data?.data || [];
  const totalPages = data?.totalPages || 0;
  const navigate = useNavigate();
  return (
    <div className="mb-32 flex flex-col gap-4">
      <div className="flex items-center justify-between rounded-lg bg-white p-3">
        <div className="flex flex-col">
          <PageHeader title="Service Entry" />
          <p className="text-sm font-medium text-slate-500">
            Manage your Service Entry
          </p>
        </div>
      </div>

      <div>
        {isLoading ? (
          <EmployeeTableSkeleton />
        ) : (
          <div className="flex flex-col items-start justify-start gap-2 overflow-clip rounded-[12px] bg-white/80 py-3 md:p-4">
            <div className="flex w-full items-center justify-between px-3 md:px-0">
              <section className="result-length flex w-full flex-row items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="h-[10px] w-[10px] rounded-full bg-blue-500"></div>
                  <h2 className="text-md min-w-max font-semibold text-zinc-800">
                    Showing {paginatedData.length} results of{" "}
                    {data?.totalRecords || 0}
                  </h2>
                </div>

                <div className="flex items-center gap-2">
                  <PaginationControls
                    totalPages={totalPages}
                    currentPage={currentPage}
                    onPageChange={setCurrentPage}
                  />
                </div>
              </section>
            </div>

            <div className="tables flex min-h-[300px] w-full flex-col overflow-x-auto bg-white shadow-sm md:overflow-x-auto md:rounded-[9px]">
              {/* Header */}
              <header className="header flex min-w-max flex-row items-center justify-between bg-slate-200 px-3 py-3 md:min-w-max">
                {/* S.No */}
                <div className="flex w-11 min-w-10 items-center justify-start gap-2 pt-1">
                  <p className="w-full text-sm font-semibold text-slate-900">
                    S.No
                  </p>
                </div>

                {/* Column Headers with responsive widths */}
                <div className="w-24 min-w-24 px-2 md:w-28 md:min-w-28">
                  <p className="text-sm font-semibold text-slate-900">Ref No</p>
                </div>
                <div className="w-24 min-w-24 px-2 md:w-28 md:min-w-28">
                  <p className="text-sm font-semibold text-slate-900">
                    Service Date
                  </p>
                </div>
                <div className="w-32 min-w-32 px-2 md:w-40 md:min-w-40">
                  <p className="text-sm font-semibold text-slate-900">Client</p>
                </div>
                <div className="w-32 min-w-32 px-2 md:w-36 md:min-w-36">
                  <p className="over text-sm font-semibold text-slate-900">
                    Maintenance Type
                  </p>
                </div>
                <div className="w-24 min-w-24 px-2 md:w-28 md:min-w-28">
                  <p className="text-sm font-semibold text-slate-900">
                    Engineer Name
                  </p>
                </div>

                <div className="w-30 min-w-30 px-2 md:w-37 md:min-w-37">
                  <p className="text-sm font-semibold text-slate-900">
                    Diagnostics
                  </p>
                </div>
                <div className="w-24 min-w-24 px-2 md:w-28 md:min-w-28">
                  <p className="text-sm font-semibold text-slate-900">Status</p>
                </div>

                {/* Action Header */}
                <div className="flex w-24 min-w-24 items-center justify-start gap-2 pt-1">
                  <p className="text-sm font-semibold text-slate-900">Action</p>
                </div>
              </header>

              {/* No data message */}
              {paginatedData.length === 0 ? (
                <h2 className="text-md my-auto text-center font-medium text-zinc-600">
                  No Entries Found
                </h2>
              ) : (
                paginatedData.map((item, index) => (
                  <div
                    key={item.id}
                    className="flex min-w-max flex-row items-center justify-between border-t px-3 py-2 text-sm text-zinc-700 hover:bg-slate-50 md:min-w-max"
                  >
                    {/* S.No */}
                    <div className="flex w-11 min-w-10 items-center justify-start gap-2 pt-1">
                      <p className="w-full">
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </p>
                    </div>

                    {/* Data Columns with responsive widths */}
                    <div className="w-24 min-w-24 px-2 md:w-28 md:min-w-28">
                      <p className="leading-5 break-words">{item.refNumber}</p>
                    </div>
                    <div className="w-24 min-w-24 px-2 pt-1 md:w-28 md:min-w-28">
                      <p className="leading-5 break-words">
                        {item.serviceDate}
                      </p>
                    </div>
                    <div className="w-32 min-w-32 px-2 pt-1 md:w-40 md:min-w-40">
                      <p className="leading-5 break-words">{item.clientName}</p>
                    </div>
                    <div className="w-32 min-w-32 px-2 md:w-36 md:min-w-36">
                      <p className="leading-5 break-words">
                        {item.maintenanceType}
                      </p>
                    </div>
                    <div className="w-24 min-w-24 px-2 pt-1 md:w-28 md:min-w-28">
                      <p className="leading-5 break-words">
                        {item.engineerName}
                      </p>
                    </div>

                    <div className="w-30 min-w-30 px-2 md:w-37 md:min-w-37">
                      <p className="leading-5 break-words">
                        {item.engineerDiagnostics}
                      </p>
                    </div>
                    <div className="w-24 min-w-24 px-2 md:w-28 md:min-w-28">
                      <span
                        className={`inline-flex min-w-full items-center justify-center rounded-full px-2 py-1 text-xs font-medium ${
                          item.serviceStatus === "Completed" ||
                          item.serviceStatus === "COMPLETED"
                            ? "bg-green-100 text-green-800"
                            : item.serviceStatus === "NOT_COMPLETED"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {item.serviceStatus === "COMPLETED"
                          ? "Completed"
                          : item.serviceStatus === "NOT_COMPLETED"
                            ? "Not Completed"
                            : "Pending"}
                      </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex w-24 min-w-24 items-center justify-start gap-2 pt-1">
                      <ButtonSm
                        className="aspect-square scale-90 border border-blue-500 bg-blue-500/10"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedEntry(item);
                          setIsViewFormOpen(true);
                        }}
                        state="outline"
                        imgUrl="/icons/eye-icon-blue.svg"
                      />
                      <ButtonSm
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedEntry(item);
                          setIsDeleteDialogOpen(true);
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

            <footer className="flex w-full flex-row items-center justify-between p-2 md:px-0">
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
        {isDeleteDialogOpen && selectedEntry && (
          <DialogBox setToggleDialogueBox={setIsDeleteDialogOpen}>
            <DeleteEntryDialogBox
              Entry={selectedEntry}
              setIsDeleteMachineDialogOpen={setIsDeleteDialogOpen}
              onDeleted={() => {
                setSelectedEntry(null);
              }}
            />
          </DialogBox>
        )}
        {isViewFormOpen && selectedEntry && (
          <DialogBox
            className="min-w-[800px]"
            setToggleDialogueBox={setIsDeleteDialogOpen}
          >
            <ServiceEntryDisplay
              data={selectedEntry}
              setIsDialogOpen={setIsViewFormOpen}
            />
          </DialogBox>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ServiceEntryPage;
