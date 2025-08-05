import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

import ButtonSm from "../../../components/common/Buttons";
import PageHeader from "../../../components/masterPage.components/PageHeader";
import MasterTableSkeleton from "../../../components/masterPage.components/LoadingSkeleton";
import ErrorComponent from "../../../components/common/Error";
import DialogBox from "../../../components/common/DialogBox";
import DropdownSelect from "../../../components/common/DropDown";
import PaginationControls from "../../../components/common/Pagination";

import ServiceEngineerEdit from "./EditEngineers.component";
import { DeleteServiceEngineerDialogBox } from "../ServiceEngineers/ServiceEngineersDialogBox";

import { useFetchServiceEngineers } from "../../../queries/masterQueries/ServiceEngineersQuery";
import { appRoutes } from "../../../routes/appRoutes";

import type { FormState } from "../../../types/appTypes";
import type { ServiceEngineerDetails } from "../../../types/masterApiTypes";
import MasterSearchBar from "@/components/common/MasterSearchBar";

const ServiceEngineerPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!Cookies.get("token")) {
      navigate(appRoutes.signInPage);
    }
  }, [navigate]);

  const [
    isDeleteServiceEngineerDialogOpen,
    setIsDeleteServiceEngineerDialogOpen,
  ] = useState(false);
  const [serviceEngineer, setServiceEngineer] =
    useState<ServiceEngineerDetails | null>(null);
  const [formState, setFormState] = useState<FormState>("create");
  const [searchValue, setSearchValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const { data, isLoading, isError, refetch } = useFetchServiceEngineers(
    currentPage,
    itemsPerPage,
    searchValue
  );

  const serviceEngineerList = data?.data || [];
  const totalPages = data?.totalPages || 0;

  useEffect(() => {
    if (!isLoading && serviceEngineerList.length === 0 && currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  }, [serviceEngineerList, isLoading]);

  const handleServiceEngineerDeleted = () => {
    setServiceEngineer(null);
    setFormState("create");
    refetch();
  };

  const renderTableContent = () => {
    if (isLoading) return <MasterTableSkeleton  />;
    if (isError)
      return (
        <div className="flex w-full justify-center py-8">
          <ErrorComponent />
        </div>
      );
    if (serviceEngineerList.length === 0)
      return (
        <div className="flex w-full justify-center py-8">
          <h2 className="text-md font-medium text-zinc-600">
            No Service Engineers Found
          </h2>
        </div>
      );

    return serviceEngineerList.map((item, index) => {
      const isSelected = serviceEngineer?.id === item.id;

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
            setServiceEngineer(item);
            setFormState("display");
          }}
        >
          <p className="w-max min-w-[50px] px-2 py-4 text-start text-sm font-medium md:min-w-[100px]">
            {(currentPage - 1) * itemsPerPage + index + 1}
          </p>
          <p className="w-full text-start text-sm font-medium">
            {item.engineerName}
          </p>
          <p className="w-full text-start text-sm font-medium">
            {item.engineerMobile}
          </p>

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
                setServiceEngineer(item);
                setFormState("edit");
              }}
            />
            <ButtonSm
              className="bg-red-100 text-red-500 outline-1 outline-red-500 hover:bg-red-100 hover:text-red-500 active:bg-red-100 active:text-red-500"
              state="default"
              text="Delete"
              onClick={(e) => {
                e.stopPropagation();
                setServiceEngineer(item);
                setIsDeleteServiceEngineerDialogOpen(true);
              }}
            />
          </div>
        </div>
      );
    });
  };

  return (
    <>
      <main className="flex w-full max-w-full flex-col gap-4 md:flex-row">
        {/* Table Section */}
        <section className="table-container flex w-full flex-col gap-3 rounded-[12px] bg-white/80 p-4 shadow-sm md:w-[50%]">
          <header className="flex flex-col items-center justify-between md:flex-row">
            <PageHeader title="Engineer Configuration" />

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

          <div className="tables flex h-full w-full flex-col overflow-clip rounded-[9px]">
            <header className="header flex w-full flex-row items-center gap-2 bg-gray-200 px-3">
              <p className="w-max min-w-[50px] px-2 py-4 text-start text-sm font-semibold text-zinc-900 md:min-w-[100px]">
                S.No
              </p>
              <p className="w-full text-start text-sm font-semibold text-zinc-900">
                Name
              </p>
              <p className="w-full text-start text-sm font-semibold text-zinc-900">
                Mobile number
              </p>
              <p className="min-w-[120px] text-start text-sm font-semibold text-zinc-900">
                Action
              </p>
            </header>

            {/* Table Content */}
            {renderTableContent()}
          </div>

          {!isLoading && !isError && serviceEngineerList.length > 0 && (
            <footer className="flex w-full justify-end">
              <PaginationControls
                totalPages={totalPages}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
              />
            </footer>
          )}
        </section>

        {/* Edit/Create Section */}
        <section className="table-container mb-20 max-h-full w-full flex-col gap-3 rounded-[12px] bg-white/80 p-4 shadow-sm md:mb-0 md:w-[50%]">
          <ServiceEngineerEdit
            serviceEngineerDetails={serviceEngineer}
            formState={formState}
            setFormState={setFormState}
            setServiceEngineerData={setServiceEngineer}
          />
        </section>
      </main>

      {/* Delete Dialog */}
      {isDeleteServiceEngineerDialogOpen && serviceEngineer && (
        <DialogBox setToggleDialogueBox={setIsDeleteServiceEngineerDialogOpen}>
          <DeleteServiceEngineerDialogBox
            serviceEngineer={serviceEngineer}
            onDeleted={handleServiceEngineerDeleted}
            setIsDeleteServiceEngineerDialogOpen={
              setIsDeleteServiceEngineerDialogOpen
            }
          />
        </DialogBox>
      )}
    </>
  );
};

export default ServiceEngineerPage;
