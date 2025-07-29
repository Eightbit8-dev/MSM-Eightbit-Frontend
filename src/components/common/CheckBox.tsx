import React from "react";

interface CheckboxInputProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  required?: boolean;
  name?: string;
}

const CheckboxInput: React.FC<CheckboxInputProps> = ({
  label,
  checked,
  onChange,
  disabled = false,
  required = false,
  name = "",
}) => {
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.checked);
  };

  return (
    <div className="flex items-center gap-2">
      <input
        type="checkbox"
        id={name}
        name={name}
        checked={checked}
        onChange={handleCheckboxChange}
        disabled={disabled}
        required={required}
        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
      />
      <label htmlFor={name} className="text-sm text-slate-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
    </div>
  );
};

export default CheckboxInput;
