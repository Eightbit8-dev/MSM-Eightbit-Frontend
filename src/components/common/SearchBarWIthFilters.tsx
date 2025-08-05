import { motion, AnimatePresence } from "framer-motion";
import { Search } from "lucide-react";
import React from "react";

interface SearchBarProps {
  isSearchable?: boolean;
  className?: string;
}

const SearchBarWithFilter: React.FC<SearchBarProps> = ({
  isSearchable,
  className,
}) => {
  const [isFocused, setIsFocused] = React.useState(false);
  const [selectedFilter, setSelectedFilter] = React.useState("Emp Name");
  const [searchValue, setSearchValue] = React.useState("");

  const filters = ["Emp Name", "Emp Code", "Bio-Metric"];

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
      className={`w-full ${className}`}
    >
      <motion.div
        layout
        transition={{
          duration: 0.3,
          ease: [0.4, 0.0, 0.2, 1], // Custom cubic-bezier for smooth animation
        }}
        className={`group relative flex items-center overflow-hidden rounded-xl border-2 bg-white shadow-sm transition-all duration-300 ease-out ${
          isFocused
            ? "border-blue-400 shadow-lg ring-4 shadow-blue-100/50 ring-blue-100/30"
            : "border-slate-200 hover:border-slate-300 hover:shadow-md"
        }`}
      >
        {/* Search Icon Button */}
        <motion.button
          type="button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.15, ease: "easeInOut" }}
          className={`flex h-full w-12 items-center justify-center transition-all duration-300 ease-out`}
        >
          <motion.div
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className={`h-6 w-6 ${isFocused ? "scale-[105%]" : "scale-[105%]"}`}
          >
            <Search
              className="h-6 w-6 text-slate-500 hover:scale-105"
              color="#6b7280"
            />
          </motion.div>
        </motion.button>

        {/* Input field */}
        <div className="relative flex-1">
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder={`Search by ${selectedFilter}`}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="w-full bg-transparent px-4 py-3 text-base font-medium text-slate-700 placeholder-slate-400 focus:outline-none"
          />

          {/* Clear button */}
          <AnimatePresence>
            {searchValue && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
                onClick={() => setSearchValue("")}
                className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* Divider */}
        <div className="h-8 w-px bg-slate-200" />

        {/* Filter Selection */}
        <div className="flex items-center px-2">
          <div className="relative flex rounded-lg bg-slate-50 p-1">
            {/* Background slider */}
            <motion.div
              animate={{
                x: `${filters.indexOf(selectedFilter) * 100}%`,
              }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
              }}
              className="absolute top-1 bottom-1 rounded-md bg-white shadow-sm"
              style={{
                width: `calc(${100 / filters.length}% - 4px)`,
                left: "2px",
              }}
            />

            {/* Filter buttons */}
            {filters.map((filter, index) => (
              <motion.button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.15 }}
                className={`relative z-10 cursor-pointer rounded-md px-3 py-1.5 text-sm font-medium transition-all duration-200 ${
                  selectedFilter === filter
                    ? "text-slate-700"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                <span className="relative z-10">{filter}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Search suggestions or results indicator */}
      <AnimatePresence>
        {isFocused && searchValue && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute z-50 mt-2 w-full rounded-lg border border-slate-200 bg-white p-3 shadow-lg"
          >
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="h-4 w-4"
              >
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              </motion.div>
              Searching for "{searchValue}" in {selectedFilter}...
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default SearchBarWithFilter;
