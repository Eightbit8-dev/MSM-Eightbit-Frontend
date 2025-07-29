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
} from "@/queries/masterQueries/MachineQuery";
import {
  useFetchBrandsOptions,
  useFetchModelsOptions,
  useFetchProductsOptions,
} from "@/queries/masterQueries/ProductQuery";
import { useFetchClientOptions } from "@/queries/masterQueries/ClientQuery";
import {
  convertToBackendDate,
  convertToFrontendDate,
} from "@/utils/commonUtils";
import type { MachineDetails } from "@/types/transactionTypes";

type Mode = "create" | "edit" | "display";

interface MachineFormPageProps {
  mode: Mode;
  machineFromParent?: MachineDetails;
  setFormVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const MachineFormPage: React.FC<MachineFormPageProps> = ({
  mode,
  machineFromParent,
  setFormVisible,
}) => {
  const isView = mode === "display";
  const isEdit = mode === "edit";
  // const isCreate = mode === "create";

  const { mutate: editMachine } = useEditMachine();
  const { mutate: createMachine } = useCreateMachine();
  const { data: clientOptions = [] } = useFetchClientOptions();
  const { data: typeOptions = [] } = useFetchProductsOptions();
  const { data: brandOptions = [] } = useFetchBrandsOptions();
  const { data: modelOptions = [] } = useFetchModelsOptions();

  const dummyData: MachineDetails = {
    id: 0,
    slNo: "",
    serialNumber: "",
    referenceNumber: "",
    installationDate: convertToFrontendDate(
      new Date().toISOString().split("T")[0],
    ),
    installedBy: "",
    machinePhotos: [],
    clientName: "",
    machineType: "",
    brand: "",
    modelNumber: "",
  };

  const [machine, setMachine] = useState<MachineDetails>(
    machineFromParent || dummyData,
  );

  const [selectedClient, setSelectedClient] = useState<DropdownOption>({
    id: 0,
    label: "Select Client",
  });
  const [selectedType, setSelectedType] = useState<DropdownOption>({
    id: 0,
    label: "Select Type",
  });
  const [selectedBrand, setSelectedBrand] = useState<DropdownOption>({
    id: 0,
    label: "Select Brand",
  });
  const [selectedModel, setSelectedModel] = useState<DropdownOption>({
    id: 0,
    label: "Select Model",
  });

  useEffect(() => {
    setMachine({
      ...machine,
      installationDate: convertToFrontendDate(machine.installationDate),
    });
    if ((isEdit || isView) && machineFromParent) {
      setMachine(machineFromParent);
      setSelectedClient(
        clientOptions.find(
          (opt) => opt.label === machineFromParent.clientName,
        ) || selectedClient,
      );
      setSelectedType(
        typeOptions.find(
          (opt) => opt.label === machineFromParent.machineType,
        ) || selectedType,
      );
      setSelectedBrand(
        brandOptions.find((opt) => opt.label === machineFromParent.brand) ||
          selectedBrand,
      );
      setSelectedModel(
        modelOptions.find(
          (opt) => opt.label === machineFromParent.modelNumber,
        ) || selectedModel,
      );
    }
  }, [
    machineFromParent,
    clientOptions,
    typeOptions,
    brandOptions,
    modelOptions,
  ]);

  const updateField = (key: keyof MachineDetails, value: string) => {
    setMachine((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isView) return;

    if (
      machine.slNo.trim() === "" ||
      machine.serialNumber.trim() === "" ||
      selectedClient.id === 0 ||
      selectedType.id === 0
    ) {
      toast.error("Please fill all required fields.");
      return;
    }

    const payload = {
      ...machine,
      installationDate: convertToBackendDate(machine.installationDate),
      clientId: selectedClient.id,
      productId: selectedType.id,
    };

    const onSuccess = () => {
      setFormVisible(false);
    };

    if (isEdit) editMachine(payload, { onSuccess });
    else createMachine(payload, { onSuccess });
  };

  if ((isEdit || isView) && !machineFromParent) {
    return <p className="p-4 text-red-600">No machine data provided.</p>;
  }

  return (
    <div className="flex min-w-full flex-col rounded-2xl bg-white">
      <h1 className="mb-6 text-2xl font-semibold capitalize">{mode} Machine</h1>
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 gap-6 md:grid-cols-2"
      >
        <Input
          title="SL No"
          placeholder="Enter SL No"
          inputValue={machine.slNo}
          onChange={(val) => updateField("slNo", val)}
          required
          disabled={isView}
        />
        <Input
          title="Machine Serial Number"
          placeholder="Enter Machine Serial Number"
          inputValue={machine.serialNumber}
          onChange={(val) => updateField("serialNumber", val)}
          required
          disabled={isView}
        />
        <Input
          title="Reference Number"
          placeholder="Enter Reference Number"
          inputValue={machine.referenceNumber}
          onChange={(val) => updateField("referenceNumber", val)}
          disabled={isView}
        />
        <DropdownSelect
          title="Brand"
          options={brandOptions}
          selected={selectedBrand}
          onChange={(val) => {
            setSelectedBrand(val);
            updateField("brand", val.label);
          }}
          required
          disabled={isView}
        />
        <DropdownSelect
          title="Model Number"
          options={modelOptions}
          selected={selectedModel}
          onChange={(val) => {
            setSelectedModel(val);
            updateField("modelNumber", val.label);
          }}
          required
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
        <DropdownSelect
          title="Machine Type"
          options={typeOptions}
          selected={selectedType}
          onChange={(val) => {
            setSelectedType(val);
            updateField("machineType", val.label);
          }}
          required
          disabled={isView}
        />
        <Input
          title="Installed By"
          placeholder="Eg : John Doe"
          inputValue={machine.installedBy}
          onChange={(val) => updateField("installedBy", val)}
          disabled={isView}
        />
        <DateInput
          title="Installation Date"
          value={machine.installationDate}
          onChange={(val) => updateField("installationDate", val)}
          required
          maxDate={new Date().toISOString().split("T")[0]}
          disabled={isView}
        />

        <div className="col-span-full mt-4 flex justify-end gap-4">
          <ButtonSm
            type="button"
            state="outline"
            onClick={() => setFormVisible(false)}
            text="Back"
          />
          {!isView && (
            <ButtonSm
              type="submit"
              state="default"
              text={isEdit ? "Save Changes" : "Create Machine"}
              className="bg-blue-600 text-white hover:bg-blue-700"
            />
          )}
        </div>
      </form>
    </div>
  );
};

export default MachineFormPage;
