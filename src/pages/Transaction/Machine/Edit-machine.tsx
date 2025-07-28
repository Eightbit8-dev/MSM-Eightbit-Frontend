import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Input, { DateInput } from "../../../components/common/Input";
import DropdownSelect, {
  type DropdownOption,
} from "../../../components/common/DropDown";
import { toast } from "react-toastify";
import type { TransactionDetails } from "../../../types/transactionTypes";
import { useFetchClientOptions } from "../../../queries/masterQueries/ClientQuery";
import { useFetchProductsOptions } from "../../../queries/masterQueries/ProductQuery";
import {
  useFetchMachine,
  useEditMachine,
} from "../../../queries/masterQueries/MachineQuery";
import {
  convertToBackendDate,
  convertToFrontendDate,
} from "@/utils/commonUtils";

const EditMachinePage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: machines, isLoading } = useFetchMachine();
  const { mutate: editMachine } = useEditMachine();
  const { data: clientOptions = [] } = useFetchClientOptions();
  const { data: typeOptions = [] } = useFetchProductsOptions();

  const [machine, setMachine] = useState<TransactionDetails | null>(null);
  const [selectedClient, setSelectedClient] = useState<DropdownOption>({
    id: 0,
    label: "Select Client",
  });
  const [selectedType, setSelectedType] = useState<DropdownOption>({
    id: 0,
    label: "Select Type",
  });

  // Load machine to edit
  useEffect(() => {
    if (!machines || !id) return;
    const found = machines.find((m) => String(m.id) === id);

    if (!found) {
      toast.error("Machine not found");
      navigate(-1);
      return;
    }

    setMachine(found);
    setMachine({
      ...found,
      installationDate: convertToFrontendDate(found.installationDate),
    });

    const clientMatch = clientOptions.find(
      (opt) => opt.label === found.clientName,
    );
    const typeMatch = typeOptions.find(
      (opt) => opt.label === found.machineType,
    );

    if (clientMatch) setSelectedClient(clientMatch);
    if (typeMatch) setSelectedType(typeMatch);
  }, [machines, id, clientOptions, typeOptions]);

  const updateField = (key: keyof TransactionDetails, value: string) => {
    setMachine((prev) => (prev ? { ...prev, [key]: value } : prev));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!machine) return;

    if (
      machine.slNo.trim() === "" ||
      machine.serialNumber.trim() === "" ||
      selectedClient.id === 0 ||
      selectedType.id === 0
    ) {
      toast.error("Please fill all required fields.");
      return;
    }

    const updatedPayload = {
      ...machine,
      installationDate: convertToBackendDate(machine.installationDate),
      clientId: selectedClient.id,
      productId: selectedType.id,
    };

    editMachine(updatedPayload, {
      onSuccess: () => {
        navigate(-1);
      },
    });
  };

  if (isLoading || !machine)
    return <p className="p-4">Loading machine data...</p>;

  return (
    <div className="mx-auto max-w-4xl rounded-2xl bg-white px-10 py-8">
      <h1 className="mb-6 text-2xl font-semibold">Edit Machine</h1>
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 gap-6 md:grid-cols-2"
      >
        <Input
          title="SL No"
          inputValue={machine.slNo}
          onChange={(val) => updateField("slNo", val)}
          required
        />
        <Input
          title="Serial Number"
          inputValue={machine.serialNumber}
          onChange={(val) => updateField("serialNumber", val)}
          required
        />
        <Input
          title="Reference Number"
          inputValue={machine.referenceNumber}
          onChange={(val) => updateField("referenceNumber", val)}
        />
        <Input
          title="Brand"
          inputValue={machine.brand}
          onChange={(val) => updateField("brand", val)}
        />
        <Input
          title="Model Number"
          inputValue={machine.modelNumber}
          onChange={(val) => updateField("modelNumber", val)}
        />

        <DropdownSelect
          title="Client"
          options={clientOptions}
          selected={selectedClient}
          onChange={setSelectedClient}
          required
        />

        <DropdownSelect
          title="Machine Type"
          options={typeOptions}
          selected={selectedType}
          onChange={setSelectedType}
          required
        />

        <Input
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
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="cursor-pointer rounded-lg border border-slate-300 px-4 py-2 text-slate-600 transition hover:bg-slate-100 active:bg-slate-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="cursor-pointer rounded-lg bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditMachinePage;
