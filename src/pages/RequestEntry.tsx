import { useEffect, useState } from "react";
import Input, { DateInput } from "@/components/common/Input";
import DropdownSelect, {
  type DropdownOption,
} from "@/components/common/DropDown";
import ButtonSm from "@/components/common/Buttons";
import MultiFileUpload from "@/components/common/FileUploadBox";
import TextArea from "@/components/common/Textarea";
import { useFetchServiceRequestById } from "@/queries/TranscationQueries/ServiceRequestQuery";
import { useParams, useSearchParams } from "react-router-dom";
import type { FormState } from "@/types/appTypes";
import { toast } from "react-toastify";
import type { ServiceEntryRequest } from "@/types/transactionTypes";
import { useFetchServiceEngineerOptions } from "@/queries/masterQueries/ServiceEngineersQuery";
import { useCreateServiceEntry } from "@/queries/TranscationQueries/ServiceEntryQuery";
import { convertToBackendDate } from "@/utils/commonUtils";
import { useFetchVendorOptions } from "@/queries/masterQueries/VendorQuery";

const RequestEntry = () => {
  //Scroped to this only as we dont use it anywhere else
  const getMaxDate = () => {
    const today = new Date();
    today.setDate(today.getDate() - 2); // Go back 2 days
    return today.toISOString().split("T")[0]; // Format to 'YYYY-MM-DD'
  };

  /**
   * We fetch the serviceRequest made by the clien(users) and use it to build this form which is serviceEntryForm this is used by technicians
   */
  const emptyData: ServiceEntryRequest = {
    refNumber: "",
    serviceDate: "",
    maintenanceType: "", //DropDownUi
    maintenanceSubType: "", //DropDownUi
    serviceRequestId: 0,
    vendorId: 0, //MasterDropDown from APi
    engineerId: 0, //MasterDropDown from APi
    engineerDiagnostics: "",
    serviceStatus: "", //DropDownUI
    remarks: "",
    complaintSparePhotoUrl: "",
    spareParts: [],
  };

  const { id } = useParams();
  const [searchParams] = useSearchParams();

  // ---------- states ----------
  const modeParam = searchParams.get("mode") as FormState;
  const [formState, setFormState] = useState<FormState>("display");

  const [formData, setFormData] = useState<ServiceEntryRequest>(emptyData);

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

  // ---------- use effects ----------

  useEffect(() => {
    if (modeParam) {
      setFormState(modeParam);
    } else {
      toast.error("Invalid url");
    }
  }, [modeParam]);

  //Fetching the service reqeest dynamically after mouting
  useEffect(() => {
    if (serviceRequestData) {
      setFormData((prev) => ({
        ...prev,
        refNumber: serviceRequestData.referenceNumber,
        serviceRequestId: serviceRequestData.id,
      }));
    }
  }, [serviceRequestData]);

  const { mutateAsync: createServiceEntry } = useCreateServiceEntry();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload: ServiceEntryRequest = {
      ...formData,
      serviceDate: convertToBackendDate(formData.serviceDate),
      spareParts: [],
      complaintSparePhotoUrl: "https://example.com/complaint-spare-photo.jpg",
    };
    createServiceEntry(payload);
  };

  if (isLoading || isEngineerOptionsLoading || isVendorLoading)
    return <p>Loading...</p>;
  if (error || !serviceRequestData) return <p>Something went wrong</p>;
  return (
    <div className="w-full rounded-lg bg-white p-6 shadow-md">
      <h2 className="mb-4 text-xl font-semibold">Request Entry</h2>
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 gap-4 md:grid-cols-2"
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

        <DropdownSelect
          title="Client Name"
          disabled
          options={[]}
          selected={{ id: 0, label: serviceRequestData.clientName }}
          onChange={() => {}}
          required
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
          selected={{ id: 404, label: serviceRequestData.brand }}
          onChange={() => {}}
        />
        <DateInput
          title="Service Date"
          disabled={formState === "display"}
          value={formData.serviceDate}
          onChange={(val) => {
            setFormData({ ...formData, serviceDate: val });
          }}
          maxDate={getMaxDate()}
          required
        />

        <DropdownSelect
          title="Maintenance Type"
          disabled={formState === "display"}
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
            title="Non-warranty Type"
            disabled={formState === "display"}
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

        <DropdownSelect
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
        <Input
          title="Engineer Diagnostics"
          name="engineerDiagnostics"
          inputValue={formData.engineerDiagnostics}
          onChange={(val) =>
            setFormData({ ...formData, engineerDiagnostics: val })
          }
          placeholder="Enter diagnosis"
        />
        <DropdownSelect
          title="Service Status"
          direction="up"
          disabled={formState === "display"}
          options={statusOptions}
          selected={
            statusOptions.find((m) => m.label === formData.serviceStatus) || {
              id: 0,
              label: "Select Service Status",
            }
          }
          onChange={(val) =>
            setFormData({ ...formData, serviceStatus: val.label })
          }
        />
        <TextArea
          title="Remarks"
          name="RequestEntryRemarks"
          placeholder="Eg : Completed within the scheduled time frame."
          inputValue={formData.remarks}
          onChange={(val) => setFormData({ ...formData, remarks: val })}
        />

        <MultiFileUpload />
        <div className="col-span-1 mt-4 flex justify-end md:col-span-2">
          <ButtonSm
            type="submit"
            text="Submit Request"
            state="default"
            className="text-white"
          />
        </div>
      </form>
    </div>
  );
};

export default RequestEntry;

// const brandOptions: DropdownOption[] = [
//   { id: 1, label: "Brand A" },
//   { id: 2, label: "Brand B" },
// ];

// const typeOptions: DropdownOption[] = [
//   { id: 1, label: "Type X" },
//   { id: 2, label: "Type Y" },
// ];

// const modelOptions: DropdownOption[] = [
//   { id: 1, label: "Model M1" },
//   { id: 2, label: "Model M2" },
// ];

// const serialOptions: DropdownOption[] = [
//   { id: 1, label: "SN12345" },
//   { id: 2, label: "SN67890" },
// ];

const maintenanceOptions: DropdownOption[] = [
  { id: 1, label: "General" },
  { id: 2, label: "Breakdown" },
  { id: 3, label: "Warranty" },
  { id: 4, label: "Non-Warranty" },
];

const maintenanceSubtTypeOptions: DropdownOption[] = [
  { id: 1, label: "Self Service" },
  { id: 2, label: "Vendor Side" },
];

const statusOptions: DropdownOption[] = [
  { id: 1, label: "Pending" },
  { id: 2, label: "Completed" },
  { id: 3, label: "Cancelled" },
];
// const dummyProblems: DropdownOption[] = [
//   { id: 101, label: "No power" },
//   { id: 102, label: "Overheating" },
//   { id: 103, label: "Noise issue" },
// ];

// const dummyEngineers: DropdownOption[] = [
//   { id: 1, label: "Engineer X" },
//   { id: 2, label: "Engineer Y" },
// ]
