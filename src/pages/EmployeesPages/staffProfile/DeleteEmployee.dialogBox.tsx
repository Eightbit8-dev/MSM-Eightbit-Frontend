import { toast } from "react-toastify";
import ButtonSm from "../../../components/common/Buttons";
import { useDeleteEmployeeProfile } from "@/queries/employeeQueries/employeesQuery";
import type { Employee } from "@/types/employeeApiTypes";

export const DeleteEmployeeDialogBox = ({
  setIsDeleteEmployeeDialogOpen,
  employeeDetails,
}: {
  setIsDeleteEmployeeDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  employeeDetails: Employee;
}) => {
  const { mutate: deleteEmployee, isPending } = useDeleteEmployeeProfile();

  const handleDelete = () => {
    deleteEmployee(employeeDetails.code, {
      onSuccess: () => {
        setIsDeleteEmployeeDialogOpen(false);
      },
      onError: () => {
        toast.error("Failed to delete Employee");
      },
    });
  };

  return (
    <form
      className="flex w-full flex-col gap-4"
      onSubmit={(e) => {
        e.preventDefault();
        handleDelete();
      }}
    >
      <header className="header flex w-full flex-row items-center justify-between text-lg font-medium text-red-600">
        Delete Employee
        <img
          onClick={() => setIsDeleteEmployeeDialogOpen(false)}
          className="w-5 cursor-pointer"
          src="/icons/close-icon.svg"
          alt="close"
        />
      </header>

      <p className="text-md font-medium text-zinc-700">
        Are you sure you want to delete the Employee{" "}
        <span className="font-semibold text-red-500">
          {employeeDetails.name + " " + employeeDetails.code}
        </span>
        ? This action is irreversible.
      </p>

      <section className="mt-1 grid w-full grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-3">
        <ButtonSm
          className="justify-center font-semibold"
          state="outline"
          text="Cancel"
          onClick={() => setIsDeleteEmployeeDialogOpen(false)}
        />
        <ButtonSm
          className="items-center justify-center bg-red-500 text-center text-white hover:bg-red-700 active:bg-red-500"
          state="default"
          type="submit"
          text={isPending ? "Deleting..." : "Delete"}
        />
      </section>
    </form>
  );
};
