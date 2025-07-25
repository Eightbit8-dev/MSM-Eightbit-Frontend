import { useState, useEffect } from "react";
import ButtonSm from "@/components/common/Buttons";
import DropdownSelect from "@/components/common/DropDown";
import { DateInput } from "@/components/common/Input";
import PageHeader from "@/components/masterPage.components/PageHeader";
import {
  useCreateEmployeeRejoin,
  useGetEmployeeRejoin,
} from "@/queries/employeeQueries/employeeRejoinQuery";

const EmployeeRejoin = () => {
  const initialState = {
    employee: { id: 0, label: "Select employee" },
    refDate: "",
    rejoinDate: "",
  };

  const [selectedEmployee, setSelectedEmployee] = useState(initialState.employee);
  const [refDate, setRefDate] = useState(initialState.refDate);
  const [rejoinDate, setRejoinDate] = useState(initialState.rejoinDate);

  const [isModified, setIsModified] = useState(false);

  const dummyEmployeeOptions = [
    { id: 0, label: "Select employee" },
    { id: 1, label: "EMP101" },
    { id: 2, label: "EMP102" },
    { id: 3, label: "EMP103" },
    { id: 4, label: "EMP104" },
    { id: 5, label: "EMP105" },
  ];

  const { mutate: submitRejoin, isPending } = useCreateEmployeeRejoin();

  // Track if form is modified
  useEffect(() => {
    const modified =
      selectedEmployee.id !== initialState.employee.id ||
      refDate !== initialState.refDate ||
      rejoinDate !== initialState.rejoinDate;
    setIsModified(modified);
  }, [selectedEmployee, refDate, rejoinDate]);

  const handleSubmit = () => {
    if (selectedEmployee.id && refDate && rejoinDate) {
      submitRejoin({
        employeeCode: selectedEmployee.label,
        refDate,
        rejoinDate,
      });
    } else {
      alert("Please fill all fields.");
    }
  };

  const handleCancel = () => {
    setSelectedEmployee(initialState.employee);
    setRefDate(initialState.refDate);
    setRejoinDate(initialState.rejoinDate);
  };

  return (
    <div className="flex flex-col gap-4">
      <section className="flex flex-col bg-white p-3 rounded-lg items-start justify-start">
        <PageHeader title="Staff Rejoin" />
        <p className="w-max text-base font-medium text-slate-500">
          Manage your Rejoined Employee
        </p>
      </section>

      <div className="rounded-lg bg-white p-4 flex flex-col gap-4">
        <div className="w-full gap-2 flex justify-end">
          {isModified && (
            <ButtonSm
              text="Cancel"
              state="outline"
              onClick={handleCancel}
              disabled={isPending}
            />
          )}
          <ButtonSm
            text={isPending ? "Submitting..." : "Submit"}
            state="default"
            className="text-white"
            onClick={handleSubmit}
            disabled={isPending}
          />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <DropdownSelect
            title="Employee Code"
            options={dummyEmployeeOptions}
            selected={selectedEmployee}
            onChange={setSelectedEmployee}
            required
          />

          <DateInput
            title="Reference Date"
            value={refDate}
            onChange={setRefDate}
            required
          />

          <DateInput
            title="Rejoin Date"
            value={rejoinDate}
            onChange={setRejoinDate}
            required
          />
        </div>
      </div>
    </div>
  );
};

export default EmployeeRejoin;
