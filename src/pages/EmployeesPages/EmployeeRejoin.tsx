import { useState } from "react";
import ButtonSm from "@/components/common/Buttons";
import DropdownSelect from "@/components/common/DropDown";
import  { DateInput } from "@/components/common/Input";
import PageHeader from "@/components/masterPage.components/PageHeader";
import {
  useCreateEmployeeRejoin,
  useGetEmployeeRejoin,
} from "@/queries/employeeQueries/employeeRejoinQuery";

const EmployeeRejoin = () => {
  const [selectedEmployee, setSelectedEmployee] = useState({ id: 0, label: "Select employee" });
  const [refDate, setRefDate] = useState("");
  const [rejoinDate, setRejoinDate] = useState("");

  const dummyEmployeeOptions = [
  { id: 0, label: "Select employee" },
  { id: 1, label: "EMP101" },
  { id: 2, label: "EMP102" },
  { id: 3, label: "EMP103" },
  { id: 4, label: "EMP104" },
  { id: 5, label: "EMP105" },
];


  // Query to get employee options
  const { data: employeeData,  } = useGetEmployeeRejoin(selectedEmployee.label);

  // Mutation to submit rejoin info
  const { mutate: submitRejoin, isPending } = useCreateEmployeeRejoin();

  const handleSubmit = () => {
    if (selectedEmployee.id && refDate && rejoinDate) {
      submitRejoin({
        employeeCode: selectedEmployee.label, // or use ID depending on backend
        refDate,
        rejoinDate,
      });
    } else {
      alert("Please fill all fields.");
    }
  };

  const employeeOptions =
    employeeData?.map((emp: any) => ({
      id: emp.id,
      label: emp.employeeCode,
    })) || [];

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-lg bg-white p-4">
        <PageHeader title="Staff-Rejoin" />
      </div>

      <div className="rounded-lg bg-white p-4 flex flex-col gap-4 ">
<div className="w-full flex justify-end">
                  <ButtonSm
          text={isPending ? "Submitting..." : "Submit"}
          state="default"
          className="text-white "
          onClick={handleSubmit}
          disabled={isPending}
        />
</div>
       <div className="flex flex-col ">
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
