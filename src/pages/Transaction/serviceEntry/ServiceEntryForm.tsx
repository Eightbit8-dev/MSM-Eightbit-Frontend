import { useEffect, useRef, useState } from "react";
import Input, { DateInput } from "@/components/common/Input";
import DropdownSelect, {
  type DropdownOption,
} from "@/components/common/DropDown";
import ButtonSm from "@/components/common/Buttons";

import { useFetchServiceRequestById } from "@/queries/TranscationQueries/ServiceRequestQuery";
import { useParams, useSearchParams } from "react-router-dom";
import type { FormState } from "@/types/appTypes";
import { toast } from "react-toastify";
import type { ServiceEntryPayload } from "@/types/transactionTypes";
import { useFetchServiceEngineerOptions } from "@/queries/masterQueries/ServiceEngineersQuery";
import { useCreateServiceEntry } from "@/queries/TranscationQueries/ServiceEntryQuery";
import {
  convertToBackendDate,
  generateReferenceNumber,
  getMaxDateFromToday,
} from "@/utils/commonUtils";
import { useFetchVendorOptions } from "@/queries/masterQueries/VendorQuery";
import {
  maintenanceOptions,
  maintenanceSubtTypeOptions,
  statusOptions,
} from "@/utils/uiUtils";
import MultiSelectDropdown from "@/components/common/MultiSelectDropDown";
import { useFetchSparesOptions } from "@/queries/masterQueries/SpareQuery";
import RequestEntrySkeleton from "./ServiceEntryFormSkeleton";
import SparePartsManager from "./SparesImageUploader.component";
import PageHeader from "@/components/masterPage.components/PageHeader";

interface SparePartData {
  spareId: number;
  quantity: number;
  complaintSparePhotoUrl?: File;
  sparePhotoUrl?: File;
}

const RequestEntry = () => {
  const emptyData: ServiceEntryPayload = {
    refNumber: "",
    serviceDate: "",
    maintenanceType: "",
    maintenanceSubType: "",
    serviceRequestId: 0,
    vendorId: 0,
    engineerId: 0,
    engineerDiagnostics: "",
    serviceStatus: "",
    remarks: "",
    complaintSparePhotoUrl: "",
    spareParts: [],
  };

  const { id } = useParams();
  const [searchParams] = useSearchParams();

  // ---------- states ----------
  const modeParam = searchParams.get("mode") as FormState;
  const [formState, setFormState] = useState<FormState>("display");
  const [formData, setFormData] = useState<ServiceEntryPayload>(emptyData);
  const [sparePartsData, setSparePartsData] = useState<SparePartData[]>([]);
  const [selectedSpares, setSelectedSpares] = useState<DropdownOption[]>([]);
  const [spareQuantities, setSpareQuantities] = useState<{
    [key: number]: number;
  }>({});

  // For scrolling into view when adding new spare
  const [latestSpareId, setLatestSpareId] = useState<number | null>(null);
  const latestSpareRef = useRef<HTMLDivElement>(null);

  // --------- external apis -----------
  const {
    data: serviceRequestData,
    isLoading,
    error,
  } = useFetchServiceRequestById(Number(id));

  const { data: engineerOptions = [], isLoading: isEngineerOptionsLoading } =
    useFetchServiceEngineerOptions();

  const { data: vendorOptions = [], isLoading: isVendorLoading } =
    useFetchVendorOptions();

  const { data: sparesOptions = [], isLoading: isSparesLoading } =
    useFetchSparesOptions();

  const {
    mutateAsync: createServiceEntry,
    isPending: isCreateServiceEntryPending,
  } = useCreateServiceEntry();

  // ---------- use effects ----------
  useEffect(() => {
    if (modeParam) {
      setFormState(modeParam);
    } else {
      toast.error("Invalid url");
    }
  }, [modeParam]);

  // Set initial form data when service request is loaded
  useEffect(() => {
    if (serviceRequestData) {
      setFormData((prev) => ({
        ...prev,
        refNumber: generateReferenceNumber("SE"),
        serviceRequestId: serviceRequestData.id,
      }));
    }
  }, [serviceRequestData]);

  // Update spare quantities
  const updateSpareQuantity = (spareId: number, quantity: number) => {
    setSpareQuantities((prev) => ({
      ...prev,
      [spareId]: Math.max(1, quantity),
    }));
  };

  // Handle spare selection changes
  const handleSparesChange = (newSpares: DropdownOption[]) => {
    const newSpareIds = new Set(newSpares.map((spare) => spare.id));
    const oldSpareIds = new Set(selectedSpares.map((spare) => spare.id));

    const addedSpare = newSpares.find((spare) => !oldSpareIds.has(spare.id));
    if (addedSpare) {
      setLatestSpareId(addedSpare.id);
    }

    setSelectedSpares(newSpares);

    // Clean up removed quantities
    setSpareQuantities((prev) => {
      const cleaned = { ...prev };
      Object.keys(cleaned).forEach((spareIdStr) => {
        const spareId = parseInt(spareIdStr);
        if (!newSpareIds.has(spareId)) {
          delete cleaned[spareId];
        }
      });
      return cleaned;
    });

    // Clean up removed spare parts data
    setSparePartsData((prev) =>
      prev.filter((spare) => newSpareIds.has(spare.spareId)),
    );
  };

  // Scroll to latest spare
  useEffect(() => {
    if (latestSpareRef.current && latestSpareId !== null) {
      latestSpareRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      setLatestSpareId(null);
    }
  }, [selectedSpares]);

  // Handle form submission
  // Fixed handleSubmit function in RequestEntry component
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Create FormData for file uploads
    const formDataToSend = new FormData();

    // Add basic form fields
    formDataToSend.append("refNumber", formData.refNumber);
    formDataToSend.append(
      "serviceDate",
      convertToBackendDate(formData.serviceDate),
    );
    formDataToSend.append("maintenanceType", formData.maintenanceType);
    formDataToSend.append("maintenanceSubType", formData.maintenanceSubType);
    formDataToSend.append(
      "serviceRequestId",
      formData.serviceRequestId.toString(),
    );
    formDataToSend.append("vendorId", formData.vendorId.toString());
    formDataToSend.append("engineerId", formData.engineerId.toString());
    formDataToSend.append("engineerDiagnostics", formData.engineerDiagnostics);
    formDataToSend.append("serviceStatus", formData.serviceStatus);
    formDataToSend.append("remarks", formData.remarks);

    // Add spare parts data with proper file handling
    sparePartsData.forEach((spare, index) => {
      formDataToSend.append(
        `spareParts[${index}][spareId]`,
        spare.spareId.toString(),
      );
      formDataToSend.append(
        `spareParts[${index}][quantity]`,
        spare.quantity.toString(),
      );

      // Add files with correct field names and null checks
      if (spare.complaintSparePhotoUrl instanceof File) {
        formDataToSend.append(
          `spareParts[${index}][complaintSparePhotoUrl]`, // Fixed field name
          spare.complaintSparePhotoUrl,
          spare.complaintSparePhotoUrl.name, // Include filename
        );
      }

      if (spare.sparePhotoUrl instanceof File) {
        formDataToSend.append(
          `spareParts[${index}][sparePhotoUrl]`, // Fixed field name
          spare.sparePhotoUrl,
          spare.sparePhotoUrl.name, // Include filename
        );
      }
    });

    // Debug: Log FormData contents (remove in production)
    console.log("FormData contents:");
    for (const pair of formDataToSend.entries()) {
      console.log(pair[0] + ": " + pair[1]);
    }

    try {
      await createServiceEntry(formDataToSend);
    } catch (error) {
      toast.error("Failed to create service entry");
      console.error(error);
    }
  };

  if (
    isLoading ||
    isEngineerOptionsLoading ||
    isVendorLoading ||
    isSparesLoading
  )
    return <RequestEntrySkeleton />;
  if (error || !serviceRequestData) return <p>Something went wrong</p>;

  return (
    <div className="flex w-full flex-col gap-3 rounded-lg bg-white p-6 shadow-md md:mb-0">
      <PageHeader title="Service Entry Detail" />
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 items-start gap-4 md:grid-cols-2"
      >
        <Input
          title="Reference No"
          name="referenceNo"
          disabled
          inputValue={formData.refNumber}
          onChange={(val) => {
            setFormData({ ...formData, refNumber: val });
          }}
        />
        <DateInput
          title="Service Date"
          disabled={formState === "display"}
          value={formData.serviceDate}
          onChange={(val) => {
            setFormData({ ...formData, serviceDate: val });
          }}
          minDate={getMaxDateFromToday(0)}
          maxDate={getMaxDateFromToday(2)}
          required
        />
        <DropdownSelect
          title="Client Name"
          disabled
          options={[]}
          selected={{ id: 0, label: serviceRequestData.clientName }}
          onChange={() => {}}
          required
        />
        <div className="flex w-full flex-col gap-3 md:flex-row">
          <DropdownSelect
            required
            className="w-full"
            title="Maintenance Type"
            options={maintenanceOptions}
            selected={
              maintenanceOptions.find(
                (m) => m.label === formData.maintenanceType,
              ) || { id: 0, label: "Select Maintenance Type" }
            }
            onChange={(val) =>
              setFormData({ ...formData, maintenanceType: val.label })
            }
          />



          {formData.maintenanceType === "Non-Warranty" && (
            <DropdownSelect
              required={formData.maintenanceType === "Non-Warranty"}
              title="Non-warranty Type"
              className="w-full"
              options={maintenanceSubtTypeOptions}
              selected={
                maintenanceSubtTypeOptions.find(
                  (m) => m.label === formData.maintenanceSubType,
                ) || { id: 0, label: "Select Non-warranty Type" }
              }
              onChange={(val) =>
                setFormData({ ...formData, maintenanceSubType: val.label })
              }
            />
          )}
          {formData.maintenanceType === "General" && (
            <Input
              required
              disabled
              className="w-full"
              title="Scope"
              inputValue="Thugil Scope"
              onChange={() => {}}
            />
          )}
          {formData.maintenanceType === "Breakdown" && (
            <Input
              required
              disabled
              className="w-full"
              title="Scope"
              inputValue="Client Scope"
              onChange={() => {}}
            />
          )}
        </div>
        <DropdownSelect
          title="ComplaintType"
          options={[]}
          disabled={true}
          selected={{ id: 404, label: serviceRequestData.complaintDetails }}
          onChange={() => {}}
        />
        <DropdownSelect
          required
          title="Vendor Name"
          options={vendorOptions}
          selected={
            vendorOptions.find((m) => m.id === formData.vendorId) || {
              id: 0,
              label: "Select Vendor",
            }
          }
          onChange={(val) => setFormData({ ...formData, vendorId: val.id })}
        />
        <DropdownSelect
          required
          title="Engineer Name"
          disabled={formState === "display"}
          options={engineerOptions}
          selected={
            engineerOptions.find((opt) => opt.id === formData.engineerId) || {
              id: 0,
              label: "Select Engineer",
            }
          }
          onChange={(val) => setFormData({ ...formData, engineerId: val.id })}
        />
        <DropdownSelect
          title="Machine Brand"
          options={[]}
          disabled={true}
          selected={{ id: 404, label: serviceRequestData.brand }}
          onChange={() => {}}
        />
        <DropdownSelect
          title="Machine Type"
          options={[]}
          disabled
          selected={{ id: 404, label: serviceRequestData.machineType }}
          onChange={() => {}}
        />
        <DropdownSelect
          title="Machine Model"
          options={[]}
          disabled
          selected={{ id: 404, label: serviceRequestData.modelNumber }}
          onChange={() => {}}
        />
        <DropdownSelect
          title="Machine Serial Number"
          disabled
          options={[]}
          selected={{ id: 404, label: serviceRequestData.serialNumber }}
          onChange={() => {}}
        />
        <Input
          required
          title="Engineer Diagnostics"
          name="engineerDiagnostics"
          className="min-h-full"
          inputValue={formData.engineerDiagnostics}
          onChange={(val) =>
            setFormData({ ...formData, engineerDiagnostics: val })
          }
          placeholder="Enter diagnosis"
        />
        <MultiSelectDropdown
          title="Spares"
          options={sparesOptions}
          selectedOptions={selectedSpares}
          onChange={handleSparesChange}
          placeholder="Select spares to add"
          required={true}
        />
        <SparePartsManager
          selectedSpares={selectedSpares}
          spareQuantities={spareQuantities}
          updateSpareQuantity={updateSpareQuantity}
          onSpareDataChange={setSparePartsData}
          latestSpareId={latestSpareId}
          latestSpareRef={latestSpareRef}
        />
        <DropdownSelect
          required
          title="Service Status"
          direction="down"
          disabled={formState === "display"}
          options={statusOptions}
          selected={
            statusOptions.find((m) => m.label === formData.serviceStatus) ?? {
              id: 0,
              label: "Pending",
            }
          }
          onChange={(val) =>
            setFormData({ ...formData, serviceStatus: val.label })
          }
        />
        <Input
          title="Remarks"
          name="RequestEntryRemarks"
          placeholder="Eg : Completed within the scheduled time frame."
          inputValue={formData.remarks}
          onChange={(val) => setFormData({ ...formData, remarks: val })}
        />
        <div className="col-span-1 flex justify-end md:col-span-2">
          <ButtonSm
            isPending={isCreateServiceEntryPending}
            type="submit"
            text="Submit"
            state="default"
            className="text-white"
          />
        </div>
      </form>
    </div>
  );
};

export default RequestEntry;
