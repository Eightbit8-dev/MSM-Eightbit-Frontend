import { useState, useEffect } from "react";
import ButtonSm from "@/components/common/Buttons";
import Input, { DateInput } from "@/components/common/Input";
import PageHeader from "@/components/masterPage.components/PageHeader";
import {
  useCreateEmployeeRejoin,
} from "@/queries/employeeQueries/employeeRejoinQuery";
import type { EmployeeRejoin } from "@/types/employeeApiTypes";

const EmployeeRejoinPage = () => {
  const initialState: EmployeeRejoin = {
    employeeCode: "",
    rejoinDate: "",
    refDate: "",
  };

  const [data, setData] = useState<EmployeeRejoin>(initialState);
  const [dummy, setDummy] = useState<EmployeeRejoin>(initialState);
  const [isModified, setIsModified] = useState(false);

  const { mutate: submitRejoin, isPending } = useCreateEmployeeRejoin();

  // Compare current data with dummy to detect changes
  useEffect(() => {
    const modified =
      data.employeeCode !== dummy.employeeCode ||
      data.refDate !== dummy.refDate ||
      data.rejoinDate !== dummy.rejoinDate;
    setIsModified(modified);
  }, [data, dummy]);

  const updateField = (field: keyof EmployeeRejoin, value: string) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    const { employeeCode, refDate, rejoinDate } = data;

    if (employeeCode && refDate && rejoinDate) {
      const payload: EmployeeRejoin = {
        employeeCode,
        refDate,
        rejoinDate,
      };
      submitRejoin(payload);
      setDummy(payload);
      setData(payload);
    } else {
      alert("Please fill all fields.");
    }
  };

  const handleCancel = () => {
    setData(dummy);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Header Section */}
      <section className="flex flex-col bg-white p-3 rounded-lg items-start justify-start">
        <PageHeader title="Staff Rejoin" />
        <p className="w-max text-base font-medium text-slate-500">
          Manage your Rejoined Employee
        </p>
      </section>

      {/* Form Section */}
      <div className="rounded-lg bg-white p-4 flex flex-col gap-4">
        <div className="grid grid-cols-3 gap-3">
          <Input
            title="Employee Code"
            inputValue={data.employeeCode}
            onChange={(val) => updateField("employeeCode", val)}
            placeholder="Enter employee code"
            maxLength={10}
            required
          />

          <DateInput
            title="Reference Date"
            value={data.refDate}
            onChange={(val) => updateField("refDate", val)}
            required
          />

          <DateInput
            title="Rejoin Date"
            value={data.rejoinDate}
            onChange={(val) => updateField("rejoinDate", val)}
            required
          />
        </div>

        {/* Buttons */}
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
      </div>
    </div>
  );
};

export default EmployeeRejoinPage;
