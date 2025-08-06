import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";

import ButtonSm from "../../../components/common/Buttons";
import ProductEdit from "./EditProduct.component";
import PageHeader from "../../../components/masterPage.components/PageHeader";
import DialogBox from "../../../components/common/DialogBox";
import { DeleteProductDialogBox } from "./DeleteProductDialogBox";
import { useFetchProductsPaginated } from "../../../queries/masterQueries/ProductQuery";
import MasterPagesSkeleton, { MasterTableSkeleton } from "../../../components/masterPage.components/LoadingSkeleton";
import ErrorComponent from "../../../components/common/Error";
import DropdownSelect from "../../../components/common/DropDown";
import PaginationControls from "../../../components/common/Pagination";
import MasterSearchBar from "@/components/common/MasterSearchBar";

import type { FormState } from "../../../types/appTypes";
import type { ProductDetails } from "../../../types/masterApiTypes";

const ProductsPage = () => {
  const [isDeleteProductDialogOpen, setIsDeleteProductDialogOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const [product, setProduct] = useState<ProductDetails>({
    id: 0,
    machineType: "",
    brand: "",
    modelNumber: "",
    description: "",
    remarks: ""
  });

  const [formState, setFormState] = useState<FormState>("create");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useFetchProductsPaginated(currentPage, itemsPerPage, searchValue); // pass searchValue here

  const productList = data?.data || [];
  const totalPages = data?.totalPages || 0;

  const handleProductDeleted = () => {
    setProduct({
      id: 0,
      machineType: "",
      brand: "",
      modelNumber: "",
      description: "",
      remarks: ""
    });
    setFormState("create");
    refetch();
  };

  useEffect(() => {
    if (!isLoading && productList.length === 0 && currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  }, [productList, isLoading]);

  const renderTableContent = () => {
    if (isLoading) {
      return <MasterTableSkeleton />;
    }

    if (isError) {
      return (
        <div className="flex w-full justify-center py-8">
          <ErrorComponent />
        </div>
      );
    }

    if (productList.length === 0) {
      return (
        <div className="flex w-full justify-center py-8">
          <h2 className="text-md font-medium text-zinc-600">No Products Found</h2>
        </div>
      );
    }

    return productList.map((item: ProductDetails, index: number) => {
      const isSelected = product?.id === item.id;
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
            setProduct({ ...item });
          }}
        >
          <p className="w-max min-w-[60px] px-2 py-4 text-start text-sm font-medium">
            {(currentPage - 1) * itemsPerPage + index + 1}
          </p>
          <p className="w-full text-start text-sm font-medium">{item.machineType}</p>
          <p className="w-full text-start text-sm font-medium">{item.brand}</p>
          <p className="w-full text-start text-sm font-medium">{item.modelNumber}</p>

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
                setProduct({ ...item });
              }}
            />
            <ButtonSm
              className="bg-red-100 text-red-500 outline-1 outline-red-500 hover:bg-red-100 hover:text-red-500 active:bg-red-100 active:text-red-500"
              state="default"
              text="Delete"
              onClick={() => {
                setProduct(item);
                setIsDeleteProductDialogOpen(true);
              }}
            />
          </div>
        </div>
      );
    });
  };

  return (
    <main className="flex w-full max-w-full flex-col gap-4 md:flex-row">
      <AnimatePresence>
        {isDeleteProductDialogOpen && (
          <DialogBox setToggleDialogueBox={setIsDeleteProductDialogOpen}>
            <DeleteProductDialogBox
              setIsDeleteProductDialogOpen={setIsDeleteProductDialogOpen}
              product={product}
              onDeleted={handleProductDeleted}
            />
          </DialogBox>
        )}
      </AnimatePresence>

      {/* Left Table Section */}
      <section className="table-container flex w-full flex-col gap-3 rounded-[12px] bg-white/80 p-4 shadow-sm md:w-[50%]">
        <header className="flex flex-col md:flex-row md:items-center items-start w-full justify-between">
          <div className="w-full justify-start items-center gap-2">
            <PageHeader title="Product Configuration" />
          </div>

          <footer className="mt-3 md:mt-0 flex w-full flex-row md:justify-end gap-2 justify-between items-center">
            <MasterSearchBar
              inputValue={searchValue}
              onChange={(e) => {
                setSearchValue(e.target.value);
                setCurrentPage(1);
              }}
              onClear={() => setSearchValue("")}
              placeholder="Search products..."
              debounceDelay={0}
              onSearch={() => {}}
            />
            <DropdownSelect
              title=""
              direction="down"
              options={[5, 10, 15, 20].map((item) => ({
                id: item,
                label: `${item} Entries`,
              }))}
              className="border-0"
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

        {/* Table */}
        <div className="tables overflow-hidden flex w-full flex-col rounded-[9px]">
          <header className="header flex w-full flex-row items-center gap-2 bg-gray-200 px-3">
            <p className="w-max min-w-[60px] px-2 py-4 text-start text-sm font-semibold text-zinc-900">
              S.No
            </p>
            <p className="w-full text-start text-sm font-semibold text-zinc-900">Machine Type</p>
            <p className="w-full text-start text-sm font-semibold text-zinc-900">Brand</p>
            <p className="w-full text-start text-sm font-semibold text-zinc-900">Model</p>
            <p className="min-w-[120px] text-start text-sm font-semibold text-zinc-900">Action</p>
          </header>
          {renderTableContent()}
        </div>

        {/* Pagination */}
        {!isLoading && !isError && productList.length > 0 && (
          <div className="flex mt-auto justify-end">
            <PaginationControls
              totalPages={totalPages}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </section>

      {/* Right Form Section */}
      <section className="table-container mb-20 md:mb-0 max-h-full w-full flex-col gap-3 rounded-[12px] bg-white/80 p-4 shadow-sm md:w-[50%]">
        <ProductEdit
          productDetails={product}
          formState={formState}
          setFormState={setFormState}
          setProduct={setProduct}
        />
      </section>
    </main>
  );
};

export default ProductsPage;
