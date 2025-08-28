// src/components/ui/Pagination.tsx
"use client";

import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  showInfo?: boolean;
}

export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  showInfo = true,
}: PaginationProps) {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const getVisiblePages = () => {
    const pages = [];
    const maxVisible = 7; // Show up to 7 page numbers

    if (totalPages <= maxVisible) {
      // Show all pages if total pages is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (currentPage <= 4) {
        // Near the beginning
        for (let i = 2; i <= 5; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 3) {
        // Near the end
        pages.push("...");
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // In the middle
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const visiblePages = getVisiblePages();

  if (totalPages <= 1) return null;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      {/* Info Section */}
      {showInfo && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div className="text-sm text-gray-700 mb-4 sm:mb-0">
            <span className="font-medium">
              Showing {startItem.toLocaleString()} to {endItem.toLocaleString()}{" "}
              of {totalItems.toLocaleString()} results
            </span>
          </div>
          <div className="text-sm text-gray-500">
            Page {currentPage} of {totalPages}
          </div>
        </div>
      )}

      {/* Pagination Controls */}
      <div className="flex items-center justify-center space-x-2">
        {/* Previous Button */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-gray-500 transition-colors duration-200"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Previous
        </button>

        {/* Page Numbers */}
        <div className="hidden sm:flex items-center space-x-1">
          {visiblePages.map((page, index) => (
            <div key={index}>
              {page === "..." ? (
                <div className="inline-flex items-center justify-center w-10 h-10">
                  <MoreHorizontal className="w-4 h-4 text-gray-400" />
                </div>
              ) : (
                <button
                  onClick={() => onPageChange(page as number)}
                  className={`inline-flex items-center justify-center w-10 h-10 text-sm font-medium rounded-lg transition-colors duration-200 ${
                    page === currentPage
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "text-gray-500 bg-white border border-gray-300 hover:bg-gray-50 hover:text-gray-700"
                  }`}
                >
                  {page}
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Mobile: Current Page Display */}
        <div className="sm:hidden inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg">
          {currentPage} / {totalPages}
        </div>

        {/* Next Button */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-gray-500 transition-colors duration-200"
        >
          Next
          <ChevronRight className="w-4 h-4 ml-1" />
        </button>
      </div>

      {/* Quick Jump Section */}
      {totalPages > 10 && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-center space-x-3">
            <span className="text-sm text-gray-600">Jump to page:</span>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                min="1"
                max={totalPages}
                placeholder="Page"
                className="w-20 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500 transition-colors duration-200"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    const page = parseInt((e.target as HTMLInputElement).value);
                    if (page >= 1 && page <= totalPages) {
                      onPageChange(page);
                      (e.target as HTMLInputElement).value = "";
                    }
                  }
                }}
              />
              <button
                onClick={() => {
                  const input = document.querySelector(
                    'input[type="number"]'
                  ) as HTMLInputElement;
                  const page = parseInt(input.value);
                  if (page >= 1 && page <= totalPages) {
                    onPageChange(page);
                    input.value = "";
                  }
                }}
                className="px-3 py-1 text-sm font-medium text-gray-600 bg-gray-100 rounded hover:bg-gray-200 transition-colors duration-200"
              >
                Go
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Progress Bar */}
      <div className="mt-4">
        <div className="w-full bg-gray-200 rounded-full h-1.5">
          <div
            className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
            style={{ width: `${(currentPage / totalPages) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}

// Alternative Compact Pagination Component
export function CompactPagination({
  currentPage,
  totalPages,
  onPageChange,
}: Omit<PaginationProps, "totalItems" | "itemsPerPage">) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center space-x-2">
      <button
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
        className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
      >
        First
      </button>

      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      <div className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg">
        {currentPage} / {totalPages}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
      >
        <ChevronRight className="w-4 h-4" />
      </button>

      <button
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
        className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
      >
        Last
      </button>
    </div>
  );
}
