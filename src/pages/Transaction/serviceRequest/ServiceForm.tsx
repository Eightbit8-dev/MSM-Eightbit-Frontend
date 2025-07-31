import React, { useEffect, useState } from "react";
import Input, { DateInput } from "@/components/common/Input";
import DropdownSelect, {
  type DropdownOption,
} from "@/components/common/DropDown";
import ButtonSm from "@/components/common/Buttons";
import { toast } from "react-toastify";
import { useFetchClientOptions } from "@/queries/masterQueries/ClientQuery";
import { useFetchMachineOptions } from "@/queries/TranscationQueries/MachineQuery";
import {
  useCreateServiceRequest,
  useEditServiceRequest,
} from "@/queries/TranscationQueries/ServiceRequestQuery";
import {
  convertToFrontendDate,
  convertToBackendDate,
} from "@/utils/commonUtils";
import type { ServiceRequest } from "@/types/transactionTypes";
import { useFetchProblemOptions } from "@/queries/masterQueries/Problem-types";

type Mode = "create" | "edit" | "display";

interface Props {
  mode: Mode;
  requestFromParent: ServiceRequest;
  setFormVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const ServiceRequestFormPage: React.FC<Props> = ({
  mode,
  requestFromParent,
  setFormVisible,
}) => {
  const isView = mode === "display";
  const isEdit = mode === "edit";

  const { mutateAsync: createServiceRequest } = useCreateServiceRequest();
  const { mutateAsync: editServiceRequest } = useEditServiceRequest();

  const { data: clientOptions = [] } = useFetchClientOptions();
  const { data: machineOptions = [] } = useFetchMachineOptions();
  const { data: complaintOptions = [] } = useFetchProblemOptions();

  const [request, setRequest] = useState<ServiceRequest>(requestFromParent);

  const [selectedClient, setSelectedClient] = useState<DropdownOption>({
    id: 0,
    label: "Select Client",
  });
  const [selectedMachine, setSelectedMachine] = useState<DropdownOption>({
    id: 0,
    label: "Select Machine",
  });
  const [selectedComplaint, setSelectedComplaint] = useState<DropdownOption>({
    id: 0,
    label: "Select Complaint",
  });

  useEffect(() => {
    if ((isEdit || isView) && requestFromParent) {
      setRequest(requestFromParent);

      setSelectedClient(
        clientOptions.find(
          (opt) => opt.label === requestFromParent.clientName,
        ) || selectedClient,
      );
      setSelectedMachine(
        machineOptions.find(
          (opt) => opt.label === requestFromParent.machineType,
        ) || selectedMachine,
      );
      if (requestFromParent.complaintDetails) {
        setSelectedComplaint(
          complaintOptions.find(
            (opt) => opt.label === requestFromParent.complaintDetails,
          ) || selectedComplaint,
        );
      }
    }
  }, [requestFromParent, clientOptions, machineOptions, complaintOptions]);

  const updateField = (key: keyof ServiceRequest, value: string) => {
    setRequest((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isView) return;

    if (
      selectedClient.id === 0 ||
      selectedMachine.id === 0 ||
      request.referenceNumber.trim() === "" ||
      request.requestDate.trim() === ""
    ) {
      toast.error("Please fill all required fields.");
      return;
    }

    const payload: ServiceRequest = {
      ...request,
      clientId: selectedClient.id,
      machineEntryId: selectedMachine.id,
      complaintDetailsId: selectedComplaint.id || undefined,
    };

    try {
      if (isEdit) {
        await editServiceRequest(payload);
        toast.success("Service Request updated successfully!");
      } else {
        await createServiceRequest(payload);
        toast.success("Service Request created successfully!");
      }
      setFormVisible(false);
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  };

  if ((isEdit || isView) && !requestFromParent) {
    return <p className="p-4 text-red-600">No request data provided.</p>;
  }

  return (
    <div className="flex min-w-full flex-col gap-0 rounded-2xl bg-white">
      <h1 className="mb-6 text-2xl font-semibold capitalize">
        {mode} Service Request
      </h1>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-3 md:gap-4 lg:gap-4"
      >
        <div className="grid grid-cols-3 gap-2 md:gap-6">
          <Input
            title="Reference No"
            placeholder="Enter Reference Number"
            inputValue={request.referenceNumber}
            onChange={(val) => updateField("referenceNumber", val)}
            required
            disabled={isView}
          />
          <DateInput
            title="Request Date"
            value={convertToFrontendDate(request.requestDate)}
            onChange={(val) =>
              updateField("requestDate", convertToBackendDate(val.toString()))
            }
            required
            maxDate={new Date().toISOString().split("T")[0]}
            disabled={isView}
          />
          <DropdownSelect
            title="Client"
            options={clientOptions}
            selected={selectedClient}
            onChange={(val) => {
              setSelectedClient(val);
              updateField("clientName", val.label);
            }}
            required
            disabled={isView}
          />
        </div>

        <div className="grid grid-cols-3 gap-2 md:gap-6">
          <DropdownSelect
            title="Machine"
            options={machineOptions}
            selected={selectedMachine}
            onChange={(val) => {
              setSelectedMachine(val);
              updateField("serialNumber", val.label);
            }}
            required
            disabled={isView}
          />
          <DropdownSelect
            title="Complaint"
            options={complaintOptions}
            selected={selectedComplaint}
            onChange={(val) => {
              setSelectedComplaint(val);
              updateField("complaintDetails", val.label);
            }}
            disabled={isView}
          />
          <Input
            title="Other Complaint (optional)"
            placeholder="Enter if complaint not listed"
            inputValue={request.otherComplaintDetails || ""}
            onChange={(val) => updateField("otherComplaintDetails", val)}
            disabled={isView}
          />
        </div>

        <div className="col-span-full mt-4 flex justify-end gap-4 md:gap-6">
          <ButtonSm
            type="button"
            state="outline"
            className="boder-[1.5px] border-slate-300"
            onClick={() => setFormVisible(false)}
            text="Back"
          />
          {!isView && (
            <ButtonSm
              type="submit"
              state="default"
              text={isEdit ? "Save Changes" : "Create Request"}
              className="bg-blue-500 text-white hover:bg-blue-700"
            />
          )}
        </div>
      </form>
    </div>
  );
};

export default ServiceRequestFormPage;
