import { motion } from "framer-motion";
import React from "react";

interface SearchBarProps {
  placeholder: string;
  isSearchable?: boolean;
  className?: string;
}

const ServicesSearchBar: React.FC<SearchBarProps> = ({
  placeholder,
  isSearchable,
  className,
}) => {
  const [isFocused, setIsFocused] = React.useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
      className={`w-full ${className}`}
    >
      <motion.div
        animate={{
          scale: isFocused ? 1.02 : 1,
        }}
        transition={{ duration: 0.2 }}
        className={`flex items-center justify-between overflow-clip rounded-lg border-[1.5px] border-slate-300 bg-white transition-all duration-200 ${
          isFocused ? "ring-[1.5px] ring-blue-500" : ""
        }`}
      >
        <input
          type="text"
          placeholder={placeholder}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="w-full bg-transparent px-4 py-0 text-base font-normal text-slate-500 focus:outline-none"
        />

        <motion.button
          animate={{
            scale: isFocused ? 1.1 : 1,
          }}
          transition={{ duration: 0.2 }}
          type="button"
          className="cursor-pointer rounded-md border-[1.5px] border-slate-300 bg-slate-200 p-3.5 transition-all duration-200 ease-in-out hover:bg-slate-300 active:bg-slate-400"
        >
          <img className="w-4" src="/icons/search-icon.svg" alt="search" />
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default ServicesSearchBar;
