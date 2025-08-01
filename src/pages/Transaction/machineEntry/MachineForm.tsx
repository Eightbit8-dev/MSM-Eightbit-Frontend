import React, { useEffect, useState } from "react";
import Input, { DateInput } from "@/components/common/Input";
import DropdownSelect, {
  type DropdownOption,
} from "@/components/common/DropDown";
import ButtonSm from "@/components/common/Buttons";
import { toast } from "react-toastify";
import {
  useEditMachine,
  useCreateMachine,
} from "@/queries/TranscationQueries/MachineQuery";
import {
  useFetchProductsType,
  useFetchProductDropdownOptions,
} from "@/queries/masterQueries/ProductQuery";
import { useFetchClientOptions } from "@/queries/masterQueries/ClientQuery";
import {
  convertToBackendDate,
  convertToFrontendDate,
} from "@/utils/commonUtils";
import type { MachineDetails } from "@/types/transactionTypes";
import MultiFileUpload from "@/components/common/FileUploadBox";

type Mode = "create" | "edit" | "display";

interface MachineFormPageProps {
  mode: Mode;
  machineFromParent: MachineDetails;
  setFormVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const MachineFormPage: React.FC<MachineFormPageProps> = ({
  mode,
  machineFromParent,
  setFormVisible,
}) => {
  const isView = mode === "display";
  const isEdit = mode === "edit";

  const { mutate: editMachine } = useEditMachine();
  const { mutate: createMachine } = useCreateMachine();
  const { data: clientOptions = [] } = useFetchClientOptions();
  const { data: typeOptions = [] } = useFetchProductsType();

  const [machine, setMachine] = useState<MachineDetails>(machineFromParent);

  const [selectedClient, setSelectedClient] = useState<DropdownOption>({
    id: 0,
    label: "Select Client",
  });
  const [selectedType, setSelectedType] = useState<DropdownOption>({
    id: 0,
    label: "Select Machine Type",
  });
  const [selectedBrand, setSelectedBrand] = useState<DropdownOption>({
    id: 0,
    label: "Select Brand",
  });
  const [selectedModel, setSelectedModel] = useState<DropdownOption>({
    id: 0,
    label: "Select Model",
  });

  const { data: brandOptions = [] } = useFetchProductDropdownOptions({
    level: "brands",
    type: selectedType.label,
  });

  const { data: modelOptions = [] } = useFetchProductDropdownOptions({
    level: "models",
    type: selectedType.label,
    brand: selectedBrand.label,
  });

const generateRefNo = () => {
  const now = new Date();
  const datePart = `${now.getFullYear().toString().slice(-1)}${now.getMonth() + 1}${now.getDate()}`; // e.g., "581" for Aug 1, 2025
  const randomPart = Math.floor(10 + Math.random() * 90); // 2-digit random number
  return `R-${datePart}${randomPart}`; // e.g., "R58147"
};


  useEffect(() => {
    if (mode === "create") {
      const generatedRef = generateRefNo();
      setMachine((prev) => ({
        ...prev,
        referenceNumber: generatedRef,
      }));
    }
  }, [mode]);

  useEffect(() => {
    if ((isEdit || isView) && machineFromParent) {
      setMachine(machineFromParent);

      setSelectedClient(
        clientOptions.find((opt) => opt.label === machineFromParent.clientName) ||
          { id: 0, label: "Select Client" },
      );

      setSelectedType(
        typeOptions.find((opt) => opt.label === machineFromParent.machineType) ||
          { id: 0, label: "Select Machine Type" },
      );

      setSelectedBrand(
        machineFromParent.brand
          ? { id: 1, label: machineFromParent.brand }
          : { id: 0, label: "Select Brand" },
      );

      setSelectedModel(
        machineFromParent.modelNumber
          ? { id: 1, label: machineFromParent.modelNumber }
          : { id: 0, label: "Select Model" },
      );
    }
  }, [machineFromParent, clientOptions, typeOptions]);

  useEffect(() => {
    if (machineFromParent.brand) {
      const brandOption = brandOptions.find(
        (opt) => opt.label === machineFromParent.brand,
      );
      if (brandOption) setSelectedBrand(brandOption);
    }
  }, [brandOptions]);

  useEffect(() => {
    if (machineFromParent.modelNumber) {
      const modelOption = modelOptions.find(
        (opt) => opt.label === machineFromParent.modelNumber,
      );
      if (modelOption) setSelectedModel(modelOption);
    }
  }, [modelOptions]);

  const updateField = (key: keyof MachineDetails, value: string) => {
    setMachine((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isView) return;

    if (
      machine.referenceNumber?.trim() === "" ||
      machine.serialNumber.trim() === "" ||
      selectedClient.id === 0 ||
      selectedModel.id === 0
    ) {
      toast.error("Please fill all required fields.");
      return;
    }

    const payload = {
      referenceNumber: machine.referenceNumber,
      serialNumber: machine.serialNumber,
      installedBy: machine.installedBy,
      installationDate: machine.installationDate,
      clientId: selectedClient.id,
      productId: selectedModel.id,
    };

    const onSuccess = () => {
      toast.success(`Machine ${isEdit ? "updated" : "created"} successfully!`);
      setFormVisible(false);
    };

    if (isEdit) editMachine(payload, { onSuccess });
    else createMachine(payload, { onSuccess });
  };

  if ((isEdit || isView) && !machineFromParent) {
    return <p className="p-4 text-red-600">No machine data provided.</p>;
  }

  return (
    <div className="flex min-w-full flex-col gap-0 rounded-2xl bg-white">
      <h1 className="mb-6 text-2xl font-semibold capitalize">{mode} Machine</h1>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-3 md:gap-4 lg:gap-4"
      >
        <div className="grid grid-cols-3 gap-2 md:gap-6">
          <Input
            title="Ref No"
            placeholder="Auto-generated Ref No"
            inputValue={machine.referenceNumber}
            onChange={(val) => updateField("referenceNumber", val)}
            required
            disabled={isView}
          />
          <DateInput
            title="Ref Date"
            value={convertToFrontendDate(machine.installationDate)}
            onChange={(val) =>
              updateField(
                "installationDate",
                convertToBackendDate(val.toString()),
              )
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
            title="Machine Type"
            options={typeOptions}
            selected={selectedType}
            onChange={(val) => {
              setSelectedType(val);
              setSelectedBrand({ id: 0, label: "Select Brand" });
              setSelectedModel({ id: 0, label: "Select Model" });
            }}
            required
            disabled={isView}
          />
          <DropdownSelect
            title="Brand"
            options={brandOptions}
            selected={selectedBrand}
            onChange={(val) => {
              setSelectedBrand(val);
              setSelectedModel({ id: 0, label: "Select Model" });
            }}
            required
            disabled={isView || selectedType.id === 0}
          />
          <DropdownSelect
            title="Model"
            options={modelOptions}
            selected={selectedModel}
            onChange={(val) => {
              setSelectedModel(val);
            }}
            required
            disabled={isView || selectedBrand.id === 0}
          />
        </div>

        <div className="grid grid-cols-3 gap-2 md:gap-6">
          <Input
            title="Machine Serial Number"
            placeholder="Enter Machine Serial Number"
            inputValue={machine.serialNumber}
            onChange={(val) => updateField("serialNumber", val)}
            required
            disabled={isView}
          />
          <Input
            title="Installed By"
            placeholder="Eg: John Doe"
            inputValue={machine.installedBy}
            onChange={(val) => updateField("installedBy", val)}
            disabled={isView}
          />
          <DateInput
            title="Installation Date"
            value={convertToFrontendDate(machine.installationDate)}
            onChange={(val) =>
              updateField(
                "installationDate",
                convertToBackendDate(val.toString()),
              )
            }
            required
            maxDate={new Date().toISOString().split("T")[0]}
            disabled={isView}
          />
        </div>

        <MultiFileUpload />

        <div className="col-span-full mt-4 flex justify-end gap-4 md:gap-6">
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
              text={isEdit ? "Save Changes" : "Create Machine"}
              className="bg-blue-500 text-white hover:bg-blue-700"
            />
          )}
        </div>
      </form>
    </div>
  );
};

export default MachineFormPage;
