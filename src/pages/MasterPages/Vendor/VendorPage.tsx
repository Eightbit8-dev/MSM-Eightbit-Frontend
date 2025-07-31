import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { AnimatePresence } from "motion/react";

import PageHeader from "../../../components/masterPage.components/PageHeader";
import MasterPagesSkeleton from "../../../components/masterPage.components/LoadingSkeleton";
import ErrorComponent from "../../../components/common/Error";
import DialogBox from "../../../components/common/DialogBox";
import ButtonSm from "../../../components/common/Buttons";
import DropdownSelect from "../../../components/common/DropDown";
import PaginationControls from "../../../components/common/Pagination";

import VendorEdit from "./EditVendor.component";
import { DeleteVendorDialogBox } from "./DeleteVendorDialogBox";
import { useFetchVendorsPaginated } from "../../../queries/masterQueries/VendorQuery";

import { appRoutes } from "../../../routes/appRoutes";
import type { VendorDetails } from "../../../types/masterApiTypes";
import type { FormState } from "../../../types/appTypes";

const VendorsPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) {
      navigate(appRoutes.signInPage);
    }
  }, [navigate]);

  const [isDeleteVendorDialogOpen, setIsDeleteVendorDialogOpen] = useState(false);
  const [vendor, setVendor] = useState<VendorDetails | null>(null);
  const [formState, setFormState] = useState<FormState>("create");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // Fetch vendors with pagination
  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useFetchVendorsPaginated(currentPage, itemsPerPage);

  const vendorList = data?.data || [];
  const totalPages = data?.totalPages || 0;
  const totalRecords = data?.totalRecords || 0;

  const handleVendorDeleted = () => {
    setVendor(null);
    setFormState("create");
  };

  // Handle page out-of-bounds
  useEffect(() => {
    if (!isLoading && vendorList.length === 0 && currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  }, [vendorList, isLoading]);

  if (isLoading) return <MasterPagesSkeleton />;
  if (isError) return <ErrorComponent />;

  return (
    <main className="flex w-full max-w-full flex-col gap-4 md:flex-row">
      {/* Delete Dialog */}
      <AnimatePresence>
        {isDeleteVendorDialogOpen && (
          <DialogBox setToggleDialogueBox={setIsDeleteVendorDialogOpen}>
            <DeleteVendorDialogBox
              setIsDeleteVendorDialogOpen={setIsDeleteVendorDialogOpen}
              setFormState={setFormState}
              setVendor={setVendor}
              vendor={vendor!}
              refetchVendors={refetch}
            />
          </DialogBox>
        )}
      </AnimatePresence>

      {/* Vendor List */}
      <section className="table-container flex w-full flex-col gap-3 rounded-[12px] bg-white/80 p-4 shadow-sm md:w-[50%]">
        <header className="flex flex-row items-center justify-between">
          <div className="flex flex-row items-center gap-2 w-full">
            <PageHeader title="Vendor Configuration" />
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
          </div>

                  <footer className="mt-2 flex w-full flex-row items-center justify-end">

          <PaginationControls
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        </footer>
        </header>

        <div className="tables flex w-full flex-col overflow-clip rounded-[9px]">
          <header className="header flex w-full flex-row items-center gap-2 bg-gray-200 px-3">
            <p className="w-max min-w-[100px] px-2 py-4 text-start text-sm font-semibold text-zinc-900">
              S.No
            </p>
            <p className="w-full text-start text-sm font-semibold text-zinc-900">Name</p>
            <p className="w-full text-start text-sm font-semibold text-zinc-900">Contact</p>
            <p className="min-w-[120px] text-start text-sm font-semibold text-zinc-900">Action</p>
          </header>

          {vendorList.length === 0 ? (
            <h2 className="text-md my-3 text-center font-medium text-zinc-600">
              No Vendors Found
            </h2>
          ) : (
            vendorList.map((item: VendorDetails, index: number) => {
              const isSelected = vendor?.id === item.id;
              return (
                <div
                  key={item.id}
                  className={`cell-1 flex w-full cursor-pointer flex-row items-center gap-2 px-3 py-2 text-zinc-700 ${
                    isSelected
                      ? "bg-gray-100 text-white"
                      : index % 2 === 0
                      ? "bg-white"
                      : "bg-slate-50"
                  } hover:bg-slate-100 active:bg-slate-200`}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (isSelected && formState === "display") return;
                    setFormState("display");
                    setVendor(item);
                  }}
                >
                  <p className="w-max min-w-[100px] px-2 py-4 text-start text-sm font-medium">
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </p>
                  <p className="w-full text-start text-sm font-medium">{item.vendorName || ""}</p>
                  <p className="w-full text-start text-sm font-medium">{item.contactPerson || ""}</p>

                  <div className="flex min-w-[120px] flex-row gap-2 text-start text-sm font-medium">
                    <ButtonSm
                      className={`${
                        formState === "edit" && isSelected
                          ? "!hover:bg-blue-100 !hover:!text-black !active:bg-blue-600 !bg-blue-500 !text-white"
                          : "bg-white"
                      }`}
                      state="outline"
                      text="Edit"
                      onClick={(e) => {
                        e.stopPropagation();
                        setFormState("edit");
                        setVendor(item);
                      }}
                    />
                    <ButtonSm
                      className="bg-red-100 text-red-500 outline-1 outline-red-500 hover:bg-red-100 hover:text-red-500 active:bg-red-100 active:text-red-500"
                      state="default"
                      text="Delete"
                      onClick={(e) => {
                        e.stopPropagation();
                        setVendor(item);
                        setIsDeleteVendorDialogOpen(true);
                      }}
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Pagination Footer */}

      </section>

      {/* Vendor Form */}
      <section className="table-container max-h-full w-full flex-col gap-3 rounded-[12px] bg-white/80 p-4 shadow-sm md:w-[50%]">
        <VendorEdit
          vendorDetails={vendor}
          formState={formState}
          setFormState={setFormState}
          setVendorData={setVendor}
        />
      </section>
    </main>
  );
};

export default VendorsPage;
