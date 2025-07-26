import { toast } from "react-toastify";
import ButtonSm from "@/components/common/Buttons";
import { useEffect } from "react";
import type { EmployeeResignation } from "@/types/employeeApiTypes";
import { useDeleteEmployeeResignation } from "@/queries/employeeQueries/employeeResignatinQuery";

const DeleteEmployeeResignationDialogBox = ({
  setIsDeleteDialogOpen,
  resignation,
  setResignationData,
}: {
  setIsDeleteDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  resignation: EmployeeResignation;
  setResignationData: React.Dispatch<
    React.SetStateAction<EmployeeResignation | null>
  >;
}) => {
  const {
    mutate: deleteResignation,
    isPending: isDeleting,
    isSuccess,
  } = useDeleteEmployeeResignation();

  useEffect(() => {
    if (isSuccess) {
      setResignationData(null);
      toast.success("Resignation deleted successfully");
    }
  }, [isSuccess]);

  const handleDelete = () => {
    if (resignation?.refNo !== undefined) {
      deleteResignation(resignation.refNo);
      setIsDeleteDialogOpen(false);
    }
  };

  return (
    <form
      className="flex w-full flex-col gap-4"
      onSubmit={(e) => {
        e.preventDefault();
        setIsDeleteDialogOpen(false);
      }}
    >
      <header className="header flex w-full flex-row items-center justify-between text-lg font-medium text-red-600">
        Delete Resignation
        <img
          onClick={() => setIsDeleteDialogOpen(false)}
          className="w-5 cursor-pointer"
          src="/icons/close-icon.svg"
          alt="close"
        />
      </header>

      <p className="text-md font-medium text-zinc-700">
        Are you sure you want to delete the resignation of{" "}
        <span className="font-semibold text-red-600">
          {resignation.employeeCode}
        </span>
        ? This action is irreversible.
      </p>

      <section className="mt-1 grid w-full grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-3">
        <ButtonSm
          className="justify-center font-semibold"
          state="outline"
          text="Cancel"
          onClick={() => setIsDeleteDialogOpen(false)}
        />
        <ButtonSm
          className="items-center justify-center bg-red-500 text-center text-white hover:bg-red-700 active:bg-red-500"
          state="default"
          onClick={handleDelete}
          text={isDeleting ? "Deleting..." : "Delete"}
        />
      </section>
    </form>
  );
};

export default DeleteEmployeeResignationDialogBox;
