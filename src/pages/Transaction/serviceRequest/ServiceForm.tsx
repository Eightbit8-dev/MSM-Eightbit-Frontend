import React, { useEffect, useRef, useState } from "react";
import Input, { DateInput } from "@/components/common/Input";
import DropdownSelect, {
  type DropdownOption,
} from "@/components/common/DropDown";
import ButtonSm from "@/components/common/Buttons";
import { toast } from "react-toastify";
import { useFetchClientOptions } from "@/queries/masterQueries/ClientQuery";
import { useFetchMachineById } from "@/queries/TranscationQueries/MachineQuery";
import {
  useCreateServiceRequest,
  useEditServiceRequest,
} from "@/queries/TranscationQueries/ServiceRequestQuery";
import { useFetchProblemOptions } from "@/queries/masterQueries/Problem-types";
import {
  convertToFrontendDate,
  convertToBackendDate,
} from "@/utils/commonUtils";
import type { ServiceRequest } from "@/types/transactionTypes";
import { Html5Qrcode } from "html5-qrcode";

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
  const isCreate = mode === "create";

  const { mutateAsync: createServiceRequest } = useCreateServiceRequest();
  const { mutateAsync: editServiceRequest } = useEditServiceRequest();

  const [machineEntryId, setMachineEntryId] = useState<number | null>(null);
  const [clientId, setClientId] = useState<number | null>(null);
  const [complaintDetailsId, setComplaintDetailsId] = useState<number | null>(
    null,
  );

  const [request, setRequest] = useState<ServiceRequest>(requestFromParent);
  const [selectedComplaint, setSelectedComplaint] = useState<DropdownOption>({
    id: 0,
    label: "Select Complaint",
  });

  const { data: complaintOptions = [] } = useFetchProblemOptions();
  const { data: machineDetails } = useFetchMachineById(machineEntryId ?? 0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (mode === "create") {
      const now = new Date();
      const year = now.getFullYear();
      const timestamp = now.getTime();
      const randomSuffix = Math.floor(Math.random() * 90 + 10);
      const generatedRef = `SR-${year}-${timestamp}${randomSuffix}`;
      const today = now.toLocaleDateString("en-GB").split("/").join("-");
      setRequest((prev) => ({
        ...prev,
        referenceNumber: generatedRef,
        requestDate: today,
      }));
    }
  }, [mode]);

  useEffect(() => {
    if ((isEdit || isView) && requestFromParent) {
      setRequest(requestFromParent);
      setMachineEntryId(requestFromParent.id || null);

      const foundComplaint = complaintOptions.find(
        (opt) => opt.label === requestFromParent.complaintDetails,
      );
      if (foundComplaint) {
        setSelectedComplaint(foundComplaint);
        setComplaintDetailsId(foundComplaint.id);
      }
    }
  }, [requestFromParent, complaintOptions]);

  const updateField = (key: keyof ServiceRequest, value: string) => {
    setRequest((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isView) return;

    if (
      !machineEntryId ||
      request.referenceNumber.trim() === "" ||
      request.requestDate.trim() === ""
    ) {
      toast.error("Please fill all required fields.");
      return;
    }

    const payload = {
      referenceNumber: request.referenceNumber,
      requestDate: request.requestDate,
      complaintDetailsId: complaintDetailsId || undefined,
      otherComplaintDetails: request.otherComplaintDetails || "",
      clientId: clientId ?? 0,
      machineEntryId: machineEntryId,
    };

    try {
      if (isEdit) {
        await editServiceRequest({ id: request.id, ...payload });
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

  const parseQRData = (data: string): { [key: string]: string } => {
    const result: { [key: string]: string } = {};
    if (data.includes(":")) {
      const lines = data.split("\n").filter((line) => line.trim() !== "");
      for (const line of lines) {
        const [key, value] = line.split(":");
        if (key && value) {
          result[key.trim()] = value.trim();
        }
      }
    } else {
      result["SL.NO"] = data.trim();
    }
    return result;
  };

  const handleQRImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const html5QrCode = new Html5Qrcode("qr-reader");
    try {
      const result = await html5QrCode.scanFile(file, true);
      const parsed = parseQRData(result);
      const serialNumber = parsed.serialNumber;
      if (!serialNumber) throw new Error("Serial number not found in QR");

      // You can now fetch the machineEntryId using the serial number
      // For now we'll assume machineEntryId is same as serialNumber for simplicity
      // Replace below line with actual API call if needed
      setMachineEntryId(Number(serialNumber.replace(/[^\d]/g, "")));
      toast.success(`QR Scanned: ${serialNumber}`);
    } catch (err) {
      console.error("QR scan error", err);
      toast.error("Failed to scan QR code.");
    }
  };

  return (
    <div className="flex min-w-full flex-col gap-0 rounded-2xl bg-white">
      <h1 className="mb-6 text-2xl font-semibold capitalize">
        {mode} Service Request
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {isCreate && (
          <div className="mb-2 flex flex-row items-center justify-between gap-2">
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleQRImageUpload}
              className="hidden"
            />
            <ButtonSm
              type="button"
              state="outline"
              text="Scan QR Image"
              onClick={() => fileInputRef.current?.click()}
              className="border-blue-400 text-blue-500"
            />
            <div id="qr-reader" className="hidden" />
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <Input
            title="Reference Number"
            placeholder="Eg: SR-2025-0001"
            inputValue={request.referenceNumber}
            onChange={(val) => updateField("referenceNumber", val)}
            required
            disabled
          />
          <DateInput
            title="Request Date"
            value={convertToFrontendDate(request.requestDate)}
            onChange={(val) =>
              updateField("requestDate", convertToBackendDate(val.toString()))
            }
            required
            disabled={isView}
          />
          <Input
            onChange={(val) => {}}
            title="Client Name"
            inputValue={machineDetails?.clientName || ""}
            disabled
          />
          <Input
            onChange={(val) => {}}
            title="Machine Type"
            inputValue={machineDetails?.machineType || ""}
            disabled
          />
          <Input
            onChange={(val) => {}}
            title="Brand"
            inputValue={machineDetails?.brand || ""}
            disabled
          />
          <Input
            onChange={(val) => {}}
            title="Model Number"
            inputValue={machineDetails?.modelNumber || ""}
            disabled
          />
          <DropdownSelect
            title="Complaint"
            options={complaintOptions}
            selected={selectedComplaint}
            onChange={(val) => {
              setSelectedComplaint(val);
              setComplaintDetailsId(val.id);
            }}
            disabled={isView}
          />
          <Input
            title="Other Complaint (Optional)"
            placeholder="Enter details if not listed"
            inputValue={request.otherComplaintDetails || ""}
            onChange={(val) => updateField("otherComplaintDetails", val)}
            disabled={isView}
          />
        </div>

        <div className="col-span-full mt-4 flex justify-end gap-4">
          <ButtonSm
            type="button"
            state="outline"
            className="border-[1.5px] border-slate-300"
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
