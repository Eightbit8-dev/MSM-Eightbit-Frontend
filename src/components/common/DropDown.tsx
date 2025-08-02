import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";

export interface DropdownOption {
  label: string;
  id: number;
}

interface DropdownSelectProps {
  title?: string;
  options: DropdownOption[];
  selected: DropdownOption;
  onChange: (option: DropdownOption) => void;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  direction?: "down" | "up" | "left" | "right";
}

const DropdownSelect: React.FC<DropdownSelectProps> = ({
  disabled = false,
  title,
  options,
  selected,
  onChange,
  required = false,
  className = "",
  direction = "down",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [shake, setShake] = useState(false);
  const [wasSubmitted, setWasSubmitted] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 🔥 Listen to form submission attempt to shake only on submit
  useEffect(() => {
    const inputId = `dropdown-hidden-${title}`;
    const input = document.getElementById(inputId);

    const handleInvalid = (event: Event) => {
      event.preventDefault(); // prevent default browser tooltip
      setWasSubmitted(true);
      setShake(true);
      setTimeout(() => setShake(false), 400);
    };

    input?.addEventListener("invalid", handleInvalid);
    return () => {
      input?.removeEventListener("invalid", handleInvalid);
    };
  }, [selected.id, required, title]);

  const toggleDropdown = () => {
    if (!disabled) setIsOpen((prev) => !prev);
  };

  const handleSelect = (option: DropdownOption) => {
    onChange(option);
    setIsOpen(false);
    setWasSubmitted(false); // reset on change
  };

  const getDirectionClass = () => {
    switch (direction) {
      case "up":
        return "bottom-full mb-2";
      case "left":
        return "right-full mr-2 top-0";
      case "right":
        return "left-full ml-2 top-0";
      case "down":
      default:
        return "top-full mt-2";
    }
  };

  const isInvalid = required && selected.id === 0 && wasSubmitted;

  return (
    <div
      className={`relative ${className} disabled:cursor-not-allowed`}
      ref={dropdownRef}
    >
      {title && (
        <h3 className="mb-0.5 w-full justify-start text-xs leading-loose font-semibold text-slate-700">
          {title}
          {required && <span className="text-red-500">*</span>}
        </h3>
      )}

      {/* Hidden input triggers native validation */}
      <input
        id={`dropdown-hidden-${title} `}
        type="text"
        required={required}
        value={selected.id === 0 ? "" : selected.id}
        onChange={() => {}}
        disabled={disabled}
        className="hidden disabled:cursor-not-allowed"
        tabIndex={-1}
      />

      <motion.div
        style={{ cursor: disabled ? "not-allowed" : "pointer" }}
        onClick={toggleDropdown}
        animate={shake ? { x: [-5, 5, -5, 5, 0] } : {}}
        transition={{ duration: 0.4 }}
        className={`input-container flex items-center justify-between rounded-xl border-2 bg-white px-3 py-3 transition-all ${
          disabled
            ? "pointer-events-none cursor-not-allowed opacity-60"
            : "cursor-pointer"
        } ${isInvalid ? "border-red-500" : isOpen ? "border-slate-500" : "border-slate-300"}`}
      >
        <span className="overflow-hidden text-sm font-medium text-ellipsis whitespace-nowrap text-slate-600">
          {selected.label}
        </span>

        <img
          src="/icons/dropdown.svg"
          alt="Dropdown icon"
          className="h-4 w-4"
        />
      </motion.div>

      {isOpen && (
        <div
          className={`absolute z-10 max-h-[200px] w-full overflow-hidden overflow-y-scroll rounded-xl border border-slate-200 bg-white shadow-lg ${getDirectionClass()}`}
        >
          {options.map((option) => (
            <button
              key={option.label}
              onClick={() => handleSelect(option)}
              className={`flex w-full cursor-pointer items-center justify-between px-4 py-2 hover:bg-slate-100 ${
                selected.label === option.label
                  ? "font-semibold text-blue-600"
                  : "text-slate-700"
              }`}
            >
              <span className="text-sm">{option.label}</span>
              {/* {selected.label === option.label && (
                <img
                  src="/icons/tick-icon-dark.svg"
                  alt="Selected"
                  className="h-4 w-4"
                />
              )} */}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default DropdownSelect;
