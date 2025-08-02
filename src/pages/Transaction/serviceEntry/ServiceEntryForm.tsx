import { useEffect, useRef, useState } from "react";
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
import {
  convertToBackendDate,
  generateReferenceNumber,
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

  const [selectedSpares, setSelectedSpares] = useState<DropdownOption[]>([]);
  const [spareQuantities, setSpareQuantities] = useState<{
    [key: number]: number;
  }>({});

  ///for scrolling into view when addinf new spare
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

  //Fetching the service reqeest dynamically after mouting
  useEffect(() => {
    if (serviceRequestData) {
      setFormData((prev) => ({
        ...prev,
        refNumber: generateReferenceNumber("SE"),
        serviceRequestId: serviceRequestData.id,
        spareParts: selectedSpares.map((spare: DropdownOption) => {
          return {
            spareId: spare.id,
            quantity: spareQuantities[spare.id] || 1, // Get quantity from state or default to 1
            sparePhotoUrl: "http://example.com/sparepart2.jpg",
          };
        }),
      }));
    }
  }, [serviceRequestData, selectedSpares, spareQuantities]); // Add spareQuantities to dependencies

  // Helper function to update quantity
  const updateSpareQuantity = (spareId: number, quantity: number) => {
    setSpareQuantities((prev) => ({
      ...prev,
      [spareId]: Math.max(1, quantity), // Ensure minimum quantity of 1
    }));
  };

  // Helper function to clean up quantities when spares are removed
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
  };

  useEffect(() => {
    if (latestSpareRef.current && latestSpareId !== null) {
      latestSpareRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      setLatestSpareId(null); // Reset after scrolling
    }
  }, [selectedSpares]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload: ServiceEntryRequest = {
      ...formData,
      serviceDate: convertToBackendDate(formData.serviceDate),

      complaintSparePhotoUrl: "https://example.com/complaint-spare-photo.jpg",
    };
    createServiceEntry(payload);
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
    <div className="mb-16 w-full rounded-lg bg-white p-6 shadow-md md:mb-0">
      <h2 className="mb-4 text-xl font-semibold">Request Entry</h2>
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
          maxDate={getMaxDate()}
          //inniku naliku nalaniku
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
              required={formData.maintenanceType === "Non-Warranty"}
              title="Non-warranty Type"
              className="w-full"
              disabled={
                formData.maintenanceType !== "Non-Warranty" ||
                formState === "display"
              }
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
        </div>
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
          selected={{ id: 404, label: serviceRequestData.brand }}
          onChange={() => {}}
        />

        <TextArea
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

        <MultiFileUpload />
        <div className="multi-select-container flex flex-col gap-3">
          <MultiSelectDropdown
            title="Spares"
            options={sparesOptions}
            selectedOptions={selectedSpares}
            onChange={handleSparesChange} // Use the helper function
            placeholder="Select spares to add"
            required={true}
          />

          {/* Quantity inputs for selected spares dont even mind this component*/}
          {selectedSpares.length > 0 && (
            <div className="my-3 flex w-full flex-col space-y-3">
              <h4 className="text-sm font-medium text-slate-700">
                Quantities:
              </h4>
              <div className="mt-2 grid grid-cols-1 gap-2">
                {selectedSpares.map((spare) => (
                  <div
                    key={spare.id}
                    ref={spare.id === latestSpareId ? latestSpareRef : null}
                    className="flex items-center justify-between rounded-lg bg-slate-50 p-2"
                  >
                    <h3 className="mb-2 text-xs leading-loose font-semibold text-slate-700">
                      {spare.label} <span className="text-red-500">*</span>
                    </h3>
                    <div className="flex flex-row items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          updateSpareQuantity(
                            spare.id,
                            (spareQuantities[spare.id] || 1) - 1,
                          )
                        }
                        className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-200 leading-0 text-slate-600 hover:bg-slate-300"
                        disabled={spareQuantities[spare.id] <= 1}
                      >
                        <img src="/icons/minus.svg" alt="-" />
                      </button>
                      <input
                        type="number"
                        min="1"
                        value={spareQuantities[spare.id] || 1}
                        onChange={(e) =>
                          updateSpareQuantity(
                            spare.id,
                            parseInt(e.target.value) || 1,
                          )
                        }
                        className="w-16 items-center rounded border border-slate-300 px-2 py-1 text-center text-sm"
                      />
                      <button
                        disabled={spareQuantities[spare.id] >= 10}
                        type="button"
                        onClick={() =>
                          updateSpareQuantity(
                            spare.id,
                            (spareQuantities[spare.id] || 1) + 1,
                          )
                        }
                        className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-200 text-slate-600 hover:bg-slate-300"
                      >
                        <img src="/icons/plus.svg" alt="-" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <DropdownSelect
          required
          title="Service Status"
          direction="up"
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
        <div className="col-span-1 mt-4 flex justify-end md:col-span-2">
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
