import { motion } from "framer-motion";
import React from "react";
import { Search } from "lucide-react";
import { useDebounce } from "@/utils/useDebounce";

interface MasterSearchBarProps {
  inputValue: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSearch: (query: string) => void;
  placeholder?: string;
  debounceDelay?: number;
}

const MasterSearchBar: React.FC<MasterSearchBarProps> = ({
  inputValue,
  onChange,
  onSearch,
  placeholder = "Search services",
  debounceDelay = 400,
}) => {
  const [isFocused, setIsFocused] = React.useState(false);
  const debouncedInput = useDebounce(inputValue, debounceDelay);

  React.useEffect(() => {
    if (debouncedInput.trim()) {
      onSearch(debouncedInput);
    }
  }, [debouncedInput]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim()) {
      onSearch(inputValue.trim());
    }
  };

  const handleSearchIconClick = () => {
    if (inputValue.trim()) {
      onSearch(inputValue.trim());
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
      className="relative select-none"
    >
      <motion.div
        animate={{ scale: isFocused ? 1.02 : 1 }}
        transition={{ duration: 0.2 }}
        className="relative rounded-xl border-2 border-slate-300 bg-white"
      >
        <div
          className="absolute inset-y-0 left-0 flex cursor-pointer items-center pl-3"
          onClick={handleSearchIconClick}
        >
          <motion.div
            animate={{
              color: isFocused ? "#3b82f6" : "#6b7280",
              scale: isFocused ? 1.1 : 1,
            }}
            transition={{ duration: 0.2 }}
          >
            <Search
              className="h-5 w-5 text-slate-500 hover:scale-105"
              color="#6b7280"
            />
          </motion.div>
        </div>
        <input
          type="text"
          value={inputValue}
          onChange={onChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="w-full rounded-xl py-3 pr-4 pl-10 text-sm font-medium text-slate-700 transition-all duration-200 select-text focus:border-transparent focus:ring-1 focus:ring-slate-500 focus:outline-none"
        />
      </motion.div>
    </motion.div>
  );
};

export default MasterSearchBar;
