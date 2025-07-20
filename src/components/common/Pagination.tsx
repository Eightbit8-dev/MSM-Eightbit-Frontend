// components/common/PaginationControls.tsx
import React from "react";

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const PaginationControls: React.FC<PaginationControlsProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
        disabled={currentPage === 1}
        className={`cursor-pointer rounded px-3 py-1 text-sm font-medium transition ${
          currentPage === 1
            ? "cursor-not-allowed text-gray-600"
            : "text-slate-800 hover:bg-gray-200"
        }`}
      >
        Previous
      </button>

      {[...Array(totalPages).keys()].map((n) => (
        <button
          key={n + 1}
          onClick={() => onPageChange(n + 1)}
          className={`aspect-square rounded px-3 py-1 transition ${
            currentPage === n + 1
              ? "bg-blue-500 text-white"
              : "bg-white text-gray-700 shadow-sm hover:bg-gray-200"
          }`}
        >
          {n + 1}
        </button>
      ))}

      <button
        onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
        disabled={currentPage === totalPages}
        className={`cursor-pointer rounded px-3 py-1 text-sm font-medium transition ${
          currentPage === totalPages
            ? "cursor-not-allowed text-gray-600"
            : "text-slate-800 hover:bg-gray-200"
        }`}
      >
        Next
      </button>
    </div>
  );
};

export default PaginationControls;
