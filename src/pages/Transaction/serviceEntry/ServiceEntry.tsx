import ButtonSm from "@/components/common/Buttons";
import PageHeader from "@/components/masterPage.components/PageHeader";
import PaginationControls from "../../../components/common/Pagination";
import EmployeeTableSkeleton from "../../TableSkleton";
import DialogBox from "@/components/common/DialogBox";
import { AnimatePresence } from "motion/react";
import type { FormState } from "@/types/appTypes";
import DropdownSelect from "@/components/common/DropDown";
import type { ServiceRequest } from "@/types/transactionTypes";
import { useState } from "react";
import { useFetchServiceRequests } from "@/queries/TranscationQueries/ServiceRequestQuery";

const ServiceEntryPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(
    null,
  );
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formState, setFormState] = useState<FormState>("create");

  const { data, isLoading } = useFetchServiceRequests(
    currentPage,
    itemsPerPage,
  );

  const paginatedData = data?.data || [];
  const totalPages = data?.totalPages || 0;

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
                  <PaginationControls
                    totalPages={totalPages}
                    currentPage={currentPage}
                    onPageChange={setCurrentPage}
                  />
                </div>
              </section>
            </div>

            <div className="tables flex min-h-[300px] w-full flex-col overflow-x-auto rounded-[9px] bg-white shadow-sm">
              {/* Header */}
              <header className="header flex min-w-max flex-row items-center bg-slate-200 px-3 py-3">
                {/* S.No + Checkbox */}
                <div className="flex w-[70px] min-w-[70px] items-center justify-start gap-2">
                  <p className="selft-center w-[40px] text-sm font-semibold text-zinc-900">
                    S.No
                  </p>
                  {/* <CheckboxInput
                    checked={isAllSelected}
                    onChange={handleSelectAllChange}
                    label=""
                  /> */}
                </div>

                {/* Column Headers */}
                <div className="flex w-full flex-row gap-2">
                  {[
                    "Ref No",
                    "Request Date",
                    "Client",
                    "Machine Type",
                    "Brand",
                    "Model Number",
                    "Complaint",
                    "Status",
                  ].map((label, index) => (
                    <p
                      key={index}
                      className="min-w-[70px] flex-1 self-center text-sm font-semibold break-words text-zinc-900"
                    >
                      {label}
                    </p>
                  ))}

                  {/* Action Header */}
                  <p className="min-w-[80px] text-sm font-semibold text-zinc-900">
                    Action
                  </p>
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
                    className="flex min-w-full flex-row items-start gap-2 border-t px-3 py-2 text-sm text-zinc-700 hover:bg-slate-50"
                  >
                    {/* S.No + Checkbox */}
                    <div className="flex w-[70px] min-w-[70px] items-center justify-start gap-2 pt-1">
                      <p className="w-[40px]">
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </p>
                      {/* <CheckboxInput
                        checked={selectedIds.includes(item.id)}
                        onChange={() => handleCheckboxChange(item.id)}
                        label=""
                      /> */}
                    </div>

                    {/* Data Columns */}
                    <div className="flex w-full flex-row gap-2">
                      {[
                        item.referenceNumber,
                        item.requestDate,
                        item.clientName,
                        item.machineType,
                        item.brand,
                        item.modelNumber,
                        item.complaintDetails,
                        item.status,
                      ].map((val, idx) => (
                        <p
                          key={idx}
                          className="min-w-[70px] flex-1 pt-1 break-words"
                        >
                          {val}
                        </p>
                      ))}

                      {/* Action Buttons */}
                      <div className="flex min-w-[80px] items-center justify-start gap-2 pt-1">
                        <ButtonSm
                          className="h-min scale-90 border-1 border-blue-500 bg-blue-500/10"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedRequest(item);
                            setFormState("edit");
                            setIsFormOpen(true);
                          }}
                          text="Service"
                          state="outline"
                          imgUrl="/icons/edit-icon.svg"
                        />
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

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
        {isFormOpen && selectedRequest && (
          <DialogBox
            setToggleDialogueBox={setIsFormOpen}
            className="lg:min-w-[800px]"
          >
            <ServiceRequestFormPage
              mode={formState}
              requestFromParent={selectedRequest}
              setFormVisible={setIsFormOpen}
            />
          </DialogBox>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ServiceEntryPage;
