import React, { use, useEffect, useRef, useState } from "react";
import Input, { DateInput } from "@/components/common/Input";
import DropdownSelect, {
  type DropdownOption,
} from "@/components/common/DropDown";
import ButtonSm from "@/components/common/Buttons";
import { toast } from "react-toastify";
import {
  useFetchMachineById,
  useFetchMachineDropdownOptions,
  useFetchMachineOptions,
} from "@/queries/TranscationQueries/MachineQuery";
import {
  useCreateServiceRequest,
  useEditServiceRequest,
} from "@/queries/TranscationQueries/ServiceRequestQuery";
import { useFetchProblemOptions } from "@/queries/masterQueries/Problem-types";
import { useFetchClientOptions } from "@/queries/masterQueries/ClientQuery";
import {
  convertToFrontendDate,
  convertToBackendDate,
} from "@/utils/commonUtils";
import {
  Html5Qrcode,
  Html5QrcodeScanner,
  Html5QrcodeScanType,
} from "html5-qrcode";
import type { ServiceRequest } from "@/types/transactionTypes";

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

  const [machineEntryId, setMachineEntryId] = useState<number | null>(null);
  const [clientId, setClientId] = useState<number | null>(null);
  const [complaintDetailsId, setComplaintDetailsId] = useState<number | null>(
    null,
  );
  const [showQRDialog, setShowQRDialog] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  const { mutateAsync: createServiceRequest } = useCreateServiceRequest();
  const { mutateAsync: editServiceRequest } = useEditServiceRequest();

  const { data: clientOptions = [] } = useFetchClientOptions();
  const { data: complaintOptions = [] } = useFetchProblemOptions();
  const { data: machineOptions = [] } = useFetchMachineOptions();

  const [request, setRequest] = useState<ServiceRequest>(requestFromParent);
  const [selectedComplaint, setSelectedComplaint] = useState<DropdownOption>({
    id: 0,
    label: "Select Complaint",
  });

  const defaultOption: DropdownOption = { id: 0, label: "Select" };
  const [selectedType, setSelectedType] =
    useState<DropdownOption>(defaultOption);
  const [selectedBrand, setSelectedBrand] =
    useState<DropdownOption>(defaultOption);
  const [selectedModel, setSelectedModel] =
    useState<DropdownOption>(defaultOption);
  const [selectedSerial, setSelectedSerial] =
    useState<DropdownOption>(defaultOption);

  const [selectedClient, setSelectedClient] =
    useState<DropdownOption>(defaultOption);

  const { data: brandOptions = [] } = useFetchMachineDropdownOptions({
    level: "brands",
    type: selectedType?.label || "",
  });

  const { data: modelOptions = [] } = useFetchMachineDropdownOptions({
    level: "models",
    type: selectedType?.label || "",
    brand: selectedBrand?.label || "",
  });

  const { data: serialOptions = [] } = useFetchMachineDropdownOptions({
    level: "serials",
    type: selectedType?.label || "",
    brand: selectedBrand?.label || "",
    model: selectedModel?.label || "",
  });

  useEffect(() => {
    if (isCreate) {
      const randomPart = Math.floor(10000 + Math.random() * 90000); // 5-digit random number
      const generatedRef = `SR-${randomPart}`; // e.g., "SR48392"
      const today = new Date().toLocaleDateString("en-GB").split("/").join("-");

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

  const parseQRData = (data: string): Record<string, string> => {
    const result: Record<string, string> = {};
    const keyMap: Record<string, string> = {
      MACHINE_ENTRY_ID: "machineEntryId",
      "SERIAL #": "serialNumber",
      "REF #": "referenceNumber",
      CLIENT: "clientName",
      TYPE: "machineType",
      BRAND: "brand",
      MODEL: "modelNumber",
      INSTALLED: "installationDate",
    };

    // Match all key-value like pairs (e.g., KEY: value, KEY= value, KEY #: value)
    const regex = /([A-Z_ #]+)[\s:=]+([^:\n\r]+)/gi;
    let match;
    while ((match = regex.exec(data)) !== null) {
      const rawKey = match[1].trim().toUpperCase();
      const value = match[2].trim();
      const normalizedKey = keyMap[rawKey] ?? rawKey.toLowerCase();
      result[normalizedKey] = value;
    }

    return result;
  };

  const handleQRProcess = (data: string) => {
    const parsed = parseQRData(data);
    const entryId = parsed.machineEntryId;
    const clientName = parsed.clientName;
    const clieendId = clientOptions.find(
      (client) => client.label === clientName,
    );

    setMachineEntryId(Number(entryId));
    setSelectedBrand({ id: 404, label: parsed.brand || "" });
    setSelectedModel({ id: 404, label: parsed.modelNumber || "" });
    setSelectedType({ id: 404, label: parsed.machineType || "" });
    setSelectedSerial({ id: 404, label: parsed.serialNumber || "" });

    if (!entryId) {
      toast.error("QR missing machineEntryId");
      return;
    }

    setMachineEntryId(Number(entryId));
    setRequest((prev) => ({
      ...prev,
      clientName: parsed.clientName || prev.clientName,
      machineType: parsed.machineType || prev.machineType,
      brand: parsed.brand || prev.brand,
      modelNumber: parsed.modelNumber || prev.modelNumber,
    }));

    const matchedClient = clientOptions.find(
      (client) => client.label.toLowerCase() === clientName?.toLowerCase(),
    );
    if (matchedClient) setClientId(matchedClient.id);
    else toast.warn(`Client '${clientName}' not found`);

    setShowQRDialog(false);
  };

  const handleQRImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const html5QrCode = new Html5Qrcode("qr-reader-img");
    try {
      const result = await html5QrCode.scanFile(file, true);
      handleQRProcess(result);
    } catch {
      toast.error("Failed to scan image QR");
    }
  };

  const updateField = (key: keyof ServiceRequest, value: string) => {
    setRequest((prev) => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    if (!showQRDialog) return;

    scannerRef.current = new Html5QrcodeScanner(
      "qr-reader-live",
      {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0,
        rememberLastUsedCamera: true,
        supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA],
      },
      false,
    );

    scannerRef.current.render(
      (text) => {
        handleQRProcess(text);
        scannerRef.current?.clear().catch(() => {});
        scannerRef.current = null;
      },
      (err) => console.warn("Live scan error", err),
    );

    return () => {
      scannerRef.current?.clear().catch(() => {});
      scannerRef.current = null;
    };
  }, [showQRDialog]);

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
      clientId: selectedClient?.id,
      machineEntryId: machineEntryId || 0,
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

  return (
    <div className="flex max-h-screen min-w-full flex-col overflow-y-auto rounded-2xl bg-white p-4 py-30 md:overflow-visible md:py-0">
      <div className="flex items-center justify-between">
        <h1 className="mb-6 text-2xl font-semibold capitalize">
          New Service Request
        </h1>

        {isCreate && (
          <>
            <ButtonSm
              type="button"
              text="Scan QR"
              state="default"
              className="mb-4 w-fit border-blue-400 text-white"
              onClick={() => setShowQRDialog(true)}
            />
            {showQRDialog && (
              <div className="bg-opacity-40 bg fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
                <div className="w-[95%] max-w-md rounded-lg bg-white p-4 shadow-xl">
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-slate-700">
                      Scan QR
                    </h2>
                    <button onClick={() => setShowQRDialog(false)}>✖</button>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleQRImageUpload}
                    className="mb-4 block w-full rounded border p-1"
                  />
                  <div id="qr-reader-live" className="rounded-md border p-2" />
                  <div id="qr-reader-img" className="hidden" />
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex min-w-full flex-col gap-4">
        <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
          <Input
            title="Reference Number"
            inputValue={request.referenceNumber}
            disabled
            required
            onChange={() => {}}
          />
          <DateInput
            title="Request Date"
            value={convertToFrontendDate(request.requestDate)}
            onChange={(val) =>
              updateField("requestDate", convertToBackendDate(val.toString()))
            }
            disabled={isView}
            required
          />
          <DropdownSelect
            title="Client"
            direction="down"
            options={clientOptions}
            selected={selectedClient}
            onChange={(val) => {
              setSelectedClient(val);
            }}
            disabled={isView}
          />
          <DropdownSelect
            title="Machine Type"
            options={machineOptions}
            selected={selectedType}
            onChange={(val) => {
              setSelectedType(val);
              setSelectedBrand(defaultOption);
              setSelectedModel(defaultOption);
              setSelectedSerial(defaultOption);
            }}
            disabled={isView}
          />
          <DropdownSelect
            title="Brand"
            options={brandOptions}
            selected={selectedBrand}
            onChange={(val) => {
              setSelectedBrand(val);
              setSelectedModel(defaultOption);
              setSelectedSerial(defaultOption);
            }}
            disabled={isView || !selectedType}
          />
          <DropdownSelect
            title="Model"
            options={modelOptions}
            selected={selectedModel}
            onChange={(val) => {
              setSelectedModel(val);
              setSelectedSerial(defaultOption);
            }}
            disabled={isView || !selectedBrand}
          />
          <DropdownSelect
            title="Serial Number"
            options={serialOptions}
            selected={selectedSerial}
            onChange={(val) => {
              setMachineEntryId(val.id);
              setSelectedSerial(val);
            }}
            disabled={isView || !selectedModel}
          />
          <DropdownSelect
            title="Complaint"
            direction="up"
            options={complaintOptions}
            selected={selectedComplaint}
            onChange={(val) => {
              setSelectedComplaint(val);
              setComplaintDetailsId(val.id);
            }}
            disabled={isView}
          />
          {/* <Input
            title="Other Complaint (Optional)"
            inputValue={request.otherComplaintDetails || ""}
            placeholder="Enter details if not listed"
            onChange={(val) => updateField("otherComplaintDetails", val)}
            disabled={isView}
          /> */}
        </div>

        <div className="mt-4 flex justify-end gap-4">
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
