import { useState, useEffect } from "react";
import ButtonSm from "@/components/common/Buttons";
import DropdownSelect from "@/components/common/DropDown";
import Input, { DateInput } from "@/components/common/Input";
import PageHeader from "@/components/masterPage.components/PageHeader";
import { useCreateEmployeeTransfer } from "../../queries/employeeQueries/employeeTransferQuery";
import TextArea from "@/components/common/Textarea";
import { useFetchBranchOptions } from "@/queries/masterQueries/BranchQuery";
import type { employeeTransfer } from "@/types/employeeApiTypes";

const EmployeeBranchTransfer = () => {
  const initialState: employeeTransfer = {
    employeeCode: "",
    date: "",
    branchFromId: 0,
    branchToId: 0,
    remarks: "",
  };

  const [formState, setFormState] = useState<employeeTransfer>(initialState);
  const [dummy, setDummy] = useState<employeeTransfer>(initialState);
  const [isModified, setIsModified] = useState(false);

  const { mutate: submitTransfer, isPending } = useCreateEmployeeTransfer();
  const {
    data: branchOptions,
    isLoading: branchLoading,
    isError: branchError,
  } = useFetchBranchOptions();

  const updateField = (key: keyof employeeTransfer, value: any) => {
    setFormState((prev) => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    const modified =
      formState.employeeCode !== dummy.employeeCode ||
      formState.branchFromId !== dummy.branchFromId ||
      formState.branchToId !== dummy.branchToId ||
      formState.date !== dummy.date ||
      formState.remarks.trim() !== dummy.remarks.trim();

    setIsModified(modified);
  }, [formState, dummy]);

  const handleSubmit = () => {
    const { employeeCode, branchFromId, branchToId, date, remarks } = formState;

    if (branchLoading) {
      alert("Branch data is still loading. Please wait.");
      return;
    }

    if (
      employeeCode &&
      branchFromId !== 0 &&
      branchToId !== 0 &&
      date &&
      remarks.trim()
    ) {
      // Send only IDs for branches
      submitTransfer({
        ...formState,
        branchFromId,
        branchToId,
      });

      setFormState(initialState);
      setDummy(initialState);
    } else {
      alert("Please fill all required fields.");
    }
  };

  const handleCancel = () => {
    setFormState(initialState);
  };

  // Helper to get branch label from ID
  const getBranchLabel = (id: number) =>
    branchOptions?.find((b) => b.id === id)?.label ?? "Select Branch";

  return (
    <div className="flex flex-col gap-4">
      <section className="flex flex-col bg-white p-3 rounded-lg items-start justify-start">
        <PageHeader title="Branch Transfer" />
        <p className="w-max text-base font-medium text-slate-500">
          Manage Employee Branch Transfers
        </p>
      </section>

      <div className="rounded-lg bg-white p-4 flex flex-col gap-4">
        {branchError && (
          <p className="text-red-600 font-semibold">
            Failed to load branch options. Please try again later.
          </p>
        )}

        <div className="grid grid-cols-2 gap-3">
          <Input
            title="Employee Code"
            inputValue={formState.employeeCode}
            onChange={(val) => updateField("employeeCode", val)}
            placeholder="Enter employee code"
            maxLength={10}
            required
          />

          <DateInput
            title="Transfer Date"
            value={formState.date}
            onChange={(val) => updateField("date", val)}
            required
          />

          <DropdownSelect
            title="From Branch"
            options={branchOptions ?? []}
            selected={{
              id: formState.branchFromId,
              label: getBranchLabel(formState.branchFromId),
            }}
            onChange={(val) => updateField("branchFromId", val.id)}
            required
            disabled={branchLoading}
          />

          <DropdownSelect
            title="To Branch"
            options={branchOptions ?? []}
            selected={{
              id: formState.branchToId,
              label: getBranchLabel(formState.branchToId),
            }}
            onChange={(val) => updateField("branchToId", val.id)}
            required
            disabled={branchLoading}
          />

          <TextArea
            title="Remarks"
            inputValue={formState.remarks}
            onChange={(val) => updateField("remarks", val)}
            required
          />
        </div>

        <div className="w-full gap-2 flex justify-end">
          {isModified && (
            <ButtonSm
              text="Cancel"
              state="outline"
              onClick={handleCancel}
              disabled={isPending || branchLoading}
            />
          )}
          <ButtonSm
            text={isPending ? "Submitting..." : "Submit"}
            state="default"
            className="text-white"
            onClick={handleSubmit}
            disabled={isPending || branchLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default EmployeeBranchTransfer;
