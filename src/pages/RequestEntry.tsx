import React, { useState } from "react";
import Input, { DateInput } from "@/components/common/Input";
import DropdownSelect, { type DropdownOption } from "@/components/common/DropDown";
import ButtonSm from "@/components/common/Buttons";
import { useFetchVendorOptions } from "../queries/masterQueries/VendorQuery"; // adjust path if needed
import MultiFileUpload from "@/components/common/FileUploadBox";
import TextArea from "@/components/common/Textarea";

// Helper to generate a random reference number
const generateReferenceNumber = () => {
  const now = new Date();
  const datePart = now.toISOString().split("T")[0].replace(/-/g, "");
  return `REF-${datePart}`;
};


const brandOptions: DropdownOption[] = [
  { id: 1, label: "Brand A" },
  { id: 2, label: "Brand B" },
];

const typeOptions: DropdownOption[] = [
  { id: 1, label: "Type X" },
  { id: 2, label: "Type Y" },
];

const modelOptions: DropdownOption[] = [
  { id: 1, label: "Model M1" },
  { id: 2, label: "Model M2" },
];

const serialOptions: DropdownOption[] = [
  { id: 1, label: "SN12345" },
  { id: 2, label: "SN67890" },
];

// const { data: vendorOptions = [], isLoading: vendorLoading } = useFetchVendorOptions();

// Helper to get today's date in YYYY-MM-DD
const getTodayDate = () => {
  return new Date().toISOString().split("T")[0];
};

const RequestEntry = () => {
  const [form, setForm] = useState({
    referenceNo: generateReferenceNumber(),
    serviceDate: getTodayDate(),
    clientName: "",
    maintenanceType: "", // General / Breakdown / Warranty / Non-Warranty
    problemReported: null as DropdownOption | null,
    vendor: null as DropdownOption | null,
    engineer: null as DropdownOption | null,
    brand: "",
    type: "",
    model: "",
    serialNumber: "",
    engineerDiagnostics: "",
  });

  const maintenanceOptions: DropdownOption[] = [
    { id: 1, label: "General" },
    { id: 2, label: "Breakdown" },
    { id: 3, label: "Warranty" },
    { id: 4, label: "Non-Warranty" },
  ];

  const dummyProblems: DropdownOption[] = [
    { id: 101, label: "No power" },
    { id: 102, label: "Overheating" },
    { id: 103, label: "Noise issue" },
  ];

  const dummyEngineers: DropdownOption[] = [
    { id: 1, label: "Engineer X" },
    { id: 2, label: "Engineer Y" },
  ];

  const updateField = (key: keyof typeof form, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form Submitted:", form);
    // Post logic here
  };

  return (
    <div className="w-full p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Request Entry</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          title="Reference No"
          inputValue={form.referenceNo}
          onChange={(val) => updateField("referenceNo", val)}
        />
        <DateInput
          title="Service Date"
          value={form.serviceDate}
          onChange={(val) => updateField("serviceDate", val.toString())}
          required
        />
        <Input
          title="Client Name"
          inputValue={form.clientName}
          onChange={(val) => updateField("clientName", val)}
          required
        />
        <DropdownSelect
          title="Maintenance Type"
          options={maintenanceOptions}
          selected={
            maintenanceOptions.find((m) => m.label === form.maintenanceType) || maintenanceOptions[0]
          }
          onChange={(val) => updateField("maintenanceType", val.label)}
        />
        <DropdownSelect
          title="Problem Reported"
          options={dummyProblems}
          selected={form.problemReported || dummyProblems[0]}
          onChange={(val) => updateField("problemReported", val)}
        />
{/* <DropdownSelect
  title="Vendor Name"
  options={vendorOptions}
  selected={form.vendor || vendorOptions[0]}
  onChange={(val) => updateField("vendor", val)}
/> */}

        <DropdownSelect
          title="Engineer Name"
          options={dummyEngineers}
          selected={form.engineer || dummyEngineers[0]}
          onChange={(val) => updateField("engineer", val)}
        />
        <DropdownSelect
  title="Brand"
  options={brandOptions}
  selected={brandOptions.find((b) => b.label === form.brand) || brandOptions[0]}
  onChange={(val) => updateField("brand", val.label)}
/>

<DropdownSelect
  title="Type"
  options={typeOptions}
  selected={typeOptions.find((t) => t.label === form.type) || typeOptions[0]}
  onChange={(val) => updateField("type", val.label)}
/>

<DropdownSelect
  title="Model"
  options={modelOptions}
  selected={modelOptions.find((m) => m.label === form.model) || modelOptions[0]}
  onChange={(val) => updateField("model", val.label)}
/>

<DropdownSelect
  title="Serial Number"
  options={serialOptions}
  selected={serialOptions.find((s) => s.label === form.serialNumber) || serialOptions[0]}
  onChange={(val) => updateField("serialNumber", val.label)}
/>



        <Input
          title="Engineer Diagnostics"
          inputValue={form.engineerDiagnostics}
          onChange={(val) => updateField("engineerDiagnostics", val)}
          placeholder="Enter diagnosis"
        />
        <TextArea
title="remarks"
name="remarks"
placeholder="remarks"
inputValue="Nan tha da leo"/>
        <MultiFileUpload/>
        <div className="col-span-1 md:col-span-2 flex justify-end mt-4">
          <ButtonSm type="submit" text="Submit Request" state="default" className="text-white" />
        </div>
      </form>
    </div>
  );
};

export default RequestEntry;
