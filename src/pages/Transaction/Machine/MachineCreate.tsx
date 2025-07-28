import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input, { DateInput } from "../../../components/common/Input";
import DropdownSelect, {
  type DropdownOption,
} from "../../../components/common/DropDown";
import { toast } from "react-toastify";
import type { TransactionDetails } from "../../../types/transactionTypes";
import { useFetchClientOptions } from "../../../queries/masterQueries/ClientQuery";
import { useFetchProductsOptions } from "../../../queries/masterQueries/ProductQuery";
import { useCreateMachine } from "../../../queries/masterQueries/MachineQuery";
import ButtonSm from "@/components/common/Buttons";

const CreateMachinePage: React.FC = () => {
  const navigate = useNavigate();
  const { mutate: createMachine } = useCreateMachine();
  const { data: clientOptions = [] } = useFetchClientOptions();
  const { data: typeOptions = [] } = useFetchProductsOptions();

  const [machine, setMachine] = useState<TransactionDetails>({
    id: 0,
    slNo: "",
    serialNumber: "",
    referenceNumber: "",
    installationDate: "",
    installedBy: "",
    machinePhotos: [],
    clientName: "",
    machineType: "",
    brand: "",
    modelNumber: "",
  });

  const [selectedClient, setSelectedClient] = useState<DropdownOption>({
    id: 0,
    label: "Select Client",
  });
  const [selectedType, setSelectedType] = useState<DropdownOption>({
    id: 0,
    label: "Select Type",
  });

  const updateField = (key: keyof TransactionDetails, value: string) => {
    setMachine((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

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
      clientId: selectedClient.id,
      productId: selectedType.id,
    };

    createMachine(payload, {
      onSuccess: () => {
        toast.success("Machine created successfully");
        navigate(-1);
      },
    });
  };

  return (
    <div className="mx-auto max-w-4xl rounded-2xl bg-white px-10 py-8">
      <h1 className="mb-6 text-2xl font-semibold">Create Machine</h1>
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 gap-6 md:grid-cols-2"
      >
        <Input
          placeholder="Enter SL No"
          title="SL No"
          inputValue={machine.slNo}
          onChange={(val) => updateField("slNo", val)}
          required
        />
        <Input
          placeholder="Enter Serial Number"
          title="Serial Number"
          inputValue={machine.serialNumber}
          onChange={(val) => updateField("serialNumber", val)}
          required
        />
        <Input
          placeholder="Enter Reference Number"
          title="Reference Number"
          inputValue={machine.referenceNumber}
          onChange={(val) => updateField("referenceNumber", val)}
        />
        <Input
          placeholder="Enter Brand"
          title="Brand"
          inputValue={machine.brand}
          onChange={(val) => updateField("brand", val)}
        />
        <Input
          placeholder="Enter Model Number"
          title="Model Number"
          inputValue={machine.modelNumber}
          onChange={(val) => updateField("modelNumber", val)}
        />

        <DropdownSelect
          title="Client"
          options={clientOptions}
          selected={
            clientOptions.find((opt) => opt.label === machine.clientName) || {
              id: 0,
              label: "Select Client ",
            }
          }
          onChange={setSelectedClient}
          required
        />

        <DropdownSelect
          title="Machine Type"
          options={typeOptions}
          selected={
            typeOptions.find((opt) => opt.label === machine.machineType) || {
              id: 0,
              label: "Select Machine type",
            }
          }
          onChange={setSelectedType}
          required
        />

        <Input
          placeholder="Enter Installed By"
          title="Installed By"
          inputValue={machine.installedBy}
          onChange={(val) => updateField("installedBy", val)}
        />

        <DateInput
          title="Installation Date"
          value={machine.installationDate}
          onChange={(val) => updateField("installationDate", val)}
          required
          maxDate={new Date().toISOString().split("T")[0]}
        />
        <div className="col-span-full mt-4 flex justify-end gap-4">
          <ButtonSm
            type="button"
            state="default"
            onClick={() => navigate(-1)}
            text="Cancel"
            className="cursor-pointer rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-600 transition hover:bg-slate-100 active:bg-slate-100"
          />

          <ButtonSm
            type="submit"
            state="default"
            text="Create Machine"
            className="cursor-pointer rounded-lg px-4 py-2 text-white transition"
          />
        </div>
      </form>
    </div>
  );
};

export default CreateMachinePage;
