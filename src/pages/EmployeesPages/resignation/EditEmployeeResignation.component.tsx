import { useEffect, useState } from "react";
import Input, { DateInput } from "@/components/common/Input";
import TextArea from "@/components/common/Textarea";
import ButtonSm from "@/components/common/Buttons";
import type { FormState } from "@/types/appTypes";
import type { EmployeeResignation } from "@/types/employeeApiTypes";

import isEqual from "lodash.isequal";
import {
  useCreateEmployeeResignation,
  useUpdateEmployeeResignation,
} from "@/queries/employeeQueries/employeeResignatinQuery";
import DropdownSelect from "@/components/common/DropDown";
import { useFetchResignationOptions } from "@/queries/masterQueries/ResiginationQuery";
import { monthOptions, yearOptions } from "@/constants";

const ResignationEdit = ({
  resignation,
  formState,
  setFormState,
  setResignationData,
}: {
  resignation: EmployeeResignation | null;
  formState: FormState;
  setFormState: React.Dispatch<React.SetStateAction<FormState>>;
  setResignationData: React.Dispatch<
    React.SetStateAction<EmployeeResignation | null>
  >;
}) => {
  const [formData, setFormData] = useState<EmployeeResignation>({
    employeeCode: "",
    reasonId: [0, "Select Reason"],
    month: "",
    year: "",
    refDate: "",
    resignationDate: "",
    leaveDate: "",
    exitInterviewStatus: "",
    resignationStatus: "",
    remarks: "",
  });

  const {
    data: resignationOptions,
    isError: isResignationOptionsError,
    isPending: isResignationOptionsPending,
  } = useFetchResignationOptions();
  const {
    mutate: createResignation,
    isPending: isCreating,
    isSuccess: isCreated,
  } = useCreateEmployeeResignation();

  const {
    mutate: updateResignation,
    isPending: isUpdating,
    isSuccess: isUpdated,
  } = useUpdateEmployeeResignation();

  // Set data on formState or prop change
  useEffect(() => {
    if (formState === "create") {
      setFormData({
        employeeCode: "",
        reasonId: 0,
        month: "",
        year: "",
        refDate: "",
        resignationDate: "",
        leaveDate: "",
        exitInterviewStatus: "",
        resignationStatus: "",
        remarks: "",
      });
    } else if (resignation) {
      setFormData(resignation);
    }
  }, [formState, resignation]);

  // Reset form on success
  useEffect(() => {
    if (isCreated || isUpdated) {
      setFormState("create");
      setResignationData(null);
    }
  }, [isCreated, isUpdated]);

  const isDisplay = formState === "display";

  const handleCancel = () => {
    setFormState("create");
    setResignationData(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formState === "create") {
      createResignation(formData);
    }
  };

  const handleUpdate = () => {
    if (formState === "edit" && resignation?.refNo !== undefined) {
      updateResignation({ refId: resignation.refNo, payload: formData });
    }
  };

  return (
    <main className="flex max-h-full w-full max-w-[870px] flex-col gap-2">
      <div className="resignation-config-container flex flex-col gap-3 rounded-[20px]">
        <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
          <header className="flex w-full flex-row items-center justify-between">
            <h1 className="text-start text-lg font-semibold text-zinc-800">
              {formState === "create"
                ? "Create Resignation"
                : `Resignation of ${formData.employeeCode}`}
            </h1>

            <section className="ml-auto flex flex-row items-center gap-3">
              {(formState === "edit" ||
                (formState === "create" &&
                  (formData.employeeCode || formData.remarks))) && (
                <ButtonSm
                  className="font-medium"
                  text="Cancel"
                  state="outline"
                  type="button"
                  onClick={handleCancel}
                />
              )}
              {formState === "display" && (
                <ButtonSm
                  className="font-medium"
                  text="Back"
                  state="outline"
                  type="button"
                  onClick={handleCancel}
                />
              )}
              {formState === "create" && (
                <ButtonSm
                  className="font-medium text-white"
                  text={isCreating ? "Creating..." : "Create"}
                  state="default"
                  type="submit"
                  disabled={isCreating}
                />
              )}
              {formState === "edit" && (
                <ButtonSm
                  className="font-medium text-white disabled:opacity-50"
                  text={isUpdating ? "Updating..." : "Save"}
                  state="default"
                  type="button"
                  onClick={handleUpdate}
                  disabled={isUpdating || isEqual(formData, resignation)}
                />
              )}
            </section>
          </header>

          <section className="grid w-full grid-cols-2 gap-3 px-0">
            <Input
              title="Employee Code"
              inputValue={formData.employeeCode}
              onChange={(val) =>
                setFormData({ ...formData, employeeCode: val })
              }
              required
              disabled={isDisplay}
            />
            {/* <Input
              title="Reason ID *"
              inputValue={formData.reasonId.toString()}
              onChange={(val) =>
                setFormData({ ...formData, reasonId: Number(val) })
              }
              required
              disabled={isDisplay}
            /> */}
            {/* <DateInput
              required
              disabled={formState === "display"}
              title="Reason ID *"
              value={formData?. || ""}
              onChange={(value) => setDataCopy({ ...dataCopy, doj: value })}
            /> */}
            <DropdownSelect
              required
              disabled={formState === "display"}
              title="Reason"
              options={resignationOptions ?? []}
              selected={
                resignationOptions?.find(
                  (opt) => opt.label === formData.reasonId[1],
                ) ?? {
                  id: 0,
                  label: "Select Reason",
                }
              }
              onChange={(value) =>
                setFormData({ ...formData, reasonId: [value.id, value.label] })
              }
            />
            <DropdownSelect
              required
              disabled={formState === "display"}
              title="Month"
              options={monthOptions ?? []}
              selected={{
                id: 404,
                label: formData.month === "" ? "Select Month" : formData.month,
              }}
              onChange={(value) =>
                setFormData({ ...formData, month: value.label })
              }
            />
            <DropdownSelect
              required
              disabled={formState === "display"}
              title="Year"
              options={yearOptions ?? []}
              selected={{
                id: 404,
                label: formData.year === "" ? "Select Year" : formData.year,
              }}
              onChange={(value) =>
                setFormData({ ...formData, year: value.label })
              }
            />

            <DateInput
              required
              disabled={formState === "display"}
              title="Reference Date"
              value={formData?.refDate || ""}
              onChange={(value) => setFormData({ ...formData, refDate: value })}
            />
            <DateInput
              required
              disabled={formState === "display"}
              title="Resignation Date"
              value={formData?.resignationDate || ""}
              onChange={(value) =>
                setFormData({ ...formData, resignationDate: value })
              }
            />
            <DateInput
              required
              disabled={formState === "display"}
              title="Leave Date"
              value={formData?.resignationDate || ""}
              onChange={(value) =>
                setFormData({ ...formData, resignationDate: value })
              }
            />
            <Input
              title="Exit Interview Status"
              inputValue={formData.exitInterviewStatus}
              onChange={(val) =>
                setFormData({ ...formData, exitInterviewStatus: val })
              }
              required
              disabled={isDisplay}
            />
            <Input
              title="Resignation Status"
              inputValue={formData.resignationStatus}
              onChange={(val) =>
                setFormData({ ...formData, resignationStatus: val })
              }
              required
              disabled={isDisplay}
            />
            <TextArea
              title="Remarks"
              inputValue={formData.remarks}
              onChange={(val) => setFormData({ ...formData, remarks: val })}
              disabled={isDisplay}
            />
          </section>
        </form>
      </div>
    </main>
  );
};

export default ResignationEdit;
