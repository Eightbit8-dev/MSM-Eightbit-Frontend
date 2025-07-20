import { motion } from "framer-motion";
import React from "react";

const ServicesSearchBar: React.FC = () => {
  const [isFocused, setIsFocused] = React.useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
      className="relative"
    >
      <motion.div
        animate={{
          scale: isFocused ? 1.02 : 1,
        }}
        transition={{ duration: 0.2 }}
        className="relative rounded-lg bg-slate-200"
      >
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <motion.div
            animate={{
              color: isFocused ? "#3b82f6" : "#6b7280",
              scale: isFocused ? 1.1 : 1,
            }}
            transition={{ duration: 0.2 }}
          >
            <img className="w-5" src="/icons/search-icon.svg" alt="search" />
          </motion.div>
        </div>
        <input
          type="text"
          placeholder="Search services"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="w-full rounded-lg border border-gray-200 py-3 pr-4 pl-12 text-sm font-medium text-slate-700 transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </motion.div>
    </motion.div>
  );
};

export default ServicesSearchBar;
