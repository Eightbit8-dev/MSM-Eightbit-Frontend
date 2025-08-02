import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";

import PageHeader from "../../../components/masterPage.components/PageHeader";
import MasterPagesSkeleton from "../../../components/masterPage.components/LoadingSkeleton";
import ErrorComponent from "../../../components/common/Error";
import DialogBox from "../../../components/common/DialogBox";
import ButtonSm from "../../../components/common/Buttons";
import DropdownSelect from "../../../components/common/DropDown";
import PaginationControls from "../../../components/common/Pagination";

import ClientEdit from "./EditClient.component";
import { DeleteClientDialogBox } from "./DeleteClientDialogBox";

import { useFetchClientsPaginated } from "../../../queries/masterQueries/ClientQuery";

import type { FormState } from "../../../types/appTypes";
import type { ClientDetails } from "../../../types/masterApiTypes";

const ClientPage = () => {
  const [isDeleteClientDialogOpen, setIsDeleteClientDialogOpen] = useState(false);

  const [client, setClient] = useState<ClientDetails>({
    id: 0,
    clientName: "",
    contactPerson: "",
    contactNumber: "",
    email: "",
    addressLine1: "",
    addressLine2:"",
    pinCode:0,
    city:"",
    state:"",
    gstNumber: "",
    remarks:""
  });

  const [formState, setFormState] = useState<FormState>("create");

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useFetchClientsPaginated(currentPage, itemsPerPage);

  const clientList = data?.data || [];
  const totalPages = data?.totalPages || 0;
  const totalRecords = data?.totalRecords || 0;

  const handleClientDeleted = () => {
    setClient({
    id: 0,
    clientName: "",
    contactPerson: "",
    contactNumber: "",
    email: "",
    addressLine1: "",
    addressLine2:"",
    pinCode:0,
    city:"",
    state:"",
    gstNumber: "",
    remarks:""
    });
    setFormState("create");
    refetch();
  };

  useEffect(() => {
    if (!isLoading && clientList.length === 0 && currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  }, [clientList, isLoading]);

  if (isLoading) return <MasterPagesSkeleton />;
  if (isError) return <ErrorComponent />;

  return (
    <main className="flex w-full max-w-full flex-col gap-4 md:flex-row">
      <AnimatePresence>
        {isDeleteClientDialogOpen && (
          <DialogBox setToggleDialogueBox={setIsDeleteClientDialogOpen}>
            <DeleteClientDialogBox
              setIsDeleteClientDialogOpen={setIsDeleteClientDialogOpen}
              client={client}
              onDeleted={handleClientDeleted}
            />
          </DialogBox>
        )}
      </AnimatePresence>

      {/* Left Table */}
      <section className="table-container flex w-full flex-col gap-3 rounded-[12px] bg-white/80 p-4 shadow-sm md:w-[50%]">
        <header className="flex h-max flex-col md:flex-row items-center justify-between">
<div className="flex flex-row w-full items-center gap-2 w-full">
            <PageHeader title="Client Configuration" />
                     
</div>
          
        {/* Pagination Footer */}
        <footer className="mt-3 md:mt-0 flex w-full flex-row items-center md:justify-end gap-2 justify-between">
 <DropdownSelect
            title=""
            direction="down"
            options={[5, 10, 15, 20].map((item) => ({
              id: item,
              label: `${item} Entries `,
            }))}
            selected={{
              id: itemsPerPage,
              label: `${itemsPerPage} Entries `,
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
        </header>

        <div className="tables flex  w-full flex-col overflow-clip rounded-[9px]">
          <header className="header flex w-full flex-row items-center gap-2 bg-gray-200 px-3">
            <p className="w-max min-w-[50px] md:min-w-[100px] px-2 py-4 text-start text-sm font-semibold text-zinc-900">
              S.No
            </p>
            <p className="w-full text-start text-sm font-semibold text-zinc-900">
              Client Name
            </p>
            <p className="w-full text-start text-sm font-semibold text-zinc-900">
              Contact Number
            </p>
            <p className="min-w-[120px] text-start text-sm font-semibold text-zinc-900">
              Action
            </p>
          </header>

          {clientList.length === 0 ? (
            <h2 className="text-md my-3 text-center font-medium text-zinc-600">
              No Clients Found
            </h2>
          ) : (
            clientList.map((item: ClientDetails, index: number) => {
              const isSelected = client?.id === item.id;
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
                    if (isSelected && formState !== "edit") return;
                    setFormState("display");
                    setClient({ ...item });
                  }}
                >
                  <p className="w-max min-w-[50px] md:min-w-[100px] px-2 py-4 text-start text-sm font-medium">
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </p>
                  <p className="w-full text-start text-sm font-medium">{item.clientName}</p>
                  <p className="w-full text-start text-sm font-medium">{item.contactNumber}</p>

                  <div className="flex min-w-[120px] flex-row gap-2 text-start text-sm font-medium">
                    <ButtonSm
                      className={`${
                        formState === "edit" && isSelected
                          ? "!hover:!bg-blue-500 !hover:!text-black !active:!bg-blue-600 !bg-blue-500 !text-white"
                          : "bg-white"
                      }`}
                      state="outline"
                      text="Edit"
                      onClick={(e) => {
                        e.stopPropagation();
                        setFormState("edit");
                        setClient({ ...item });
                      }}
                    />
                    <ButtonSm
                      className="bg-red-100 text-red-500 outline-1 outline-red-500 hover:bg-red-100 hover:text-red-500 active:bg-red-100 active:text-red-500"
                      state="default"
                      text="Delete"
                      onClick={() => {
                        setClient(item);
                        setIsDeleteClientDialogOpen(true);
                      }}
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>

      </section>

      {/* Right Form */}
      <section className="table-container max-h-full mb-20 md:mb-0 w-full flex-col gap-3 rounded-[12px] bg-white/80 p-4 shadow-sm md:w-[50%]">
        <ClientEdit
          clientDetails={client}
          formState={formState}
          setFormState={setFormState}
          setClient={setClient}
        />
      </section>
    </main>
  );
};

export default ClientPage;
