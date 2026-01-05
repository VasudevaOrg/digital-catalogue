// src/components/ui/GlobalSearch.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, X, Loader2, Package } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";
import { productAPI } from "@/lib/api";
import { Product } from "@/types";
import Link from "next/link";
import { useAppDispatch } from "@/store";
import { setSearchQuery } from "@/store/slices/productSlice";

interface GlobalSearchProps {
  onClose?: () => void;
  autoFocus?: boolean;
}

export function GlobalSearch({
  onClose,
  autoFocus = false,
}: GlobalSearchProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const debouncedQuery = useDebounce(query, 300);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Fetch suggestions when debounced query changes
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (debouncedQuery.trim().length < 2) {
        setSuggestions([]);
        setIsOpen(false);
        return;
      }

      setIsLoading(true);
      try {
        const response = await productAPI.getAll({
          search: debouncedQuery,
          limit: 6,
        });
        setSuggestions(response.data || []);
        setIsOpen(true);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSuggestions();
  }, [debouncedQuery]);

  // Handle clicks outside of the search container
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (query.trim()) {
      dispatch(setSearchQuery(query));
      router.push(`/products?search=${encodeURIComponent(query)}`);
      setIsOpen(false);
      if (onClose) onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > -1 ? prev - 1 : prev));
    } else if (e.key === "Enter") {
      if (selectedIndex !== -1 && suggestions[selectedIndex]) {
        e.preventDefault();
        router.push(`/products/${suggestions[selectedIndex].id}`);
        setIsOpen(false);
        if (onClose) onClose();
      } else {
        handleSearchSubmit();
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-2xl mx-auto pt-4">
      <form onSubmit={handleSearchSubmit} className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
          <Search className="w-4 sm:w-5 h-4 sm:h-5 text-gray-400" />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setSelectedIndex(-1);
          }}
          onFocus={() => {
            if (suggestions.length > 0) setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
          autoFocus={autoFocus}
          placeholder="Search for products, categories, or brands..."
          className="w-full pl-10 sm:pl-12 pr-16 sm:pr-24 py-3 sm:py-4 bg-gray-50 border-2 border-gray-200 rounded-xl sm:rounded-2xl focus:border-blue-500 focus:bg-white outline-none transition-all duration-300 text-gray-800 placeholder-gray-500 text-sm sm:text-base"
        />
        <div className="absolute inset-y-0 right-0 pr-2 flex items-center space-x-2">
          {isLoading && (
            <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
          )}
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="p-1 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            type="submit"
            className="hidden sm:block bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 sm:px-6 py-2 rounded-lg sm:rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 text-sm sm:text-base shadow-sm"
          >
            Search
          </button>
        </div>
      </form>

      {/* Suggestions Dropdown */}
      {isOpen && query.trim().length >= 2 && (
        <div className="absolute z-50 w-full mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in duration-200">
          {suggestions.length > 0 ? (
            <div className="py-2">
              <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50/50">
                Products Found
              </div>
              <ul className="divide-y divide-gray-50">
                {suggestions.map((product, index) => (
                  <li key={product.id}>
                    <Link
                      href={`/products/${product.id}`}
                      onClick={() => {
                        setIsOpen(false);
                        if (onClose) onClose();
                      }}
                      className={`flex items-center px-4 py-3 hover:bg-blue-50 transition-colors group ${
                        selectedIndex === index ? "bg-blue-50" : ""
                      }`}
                    >
                      <div className="w-10 h-10 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden mr-3">
                        {product.images?.[0] ? (
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="w-5 h-5 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          {product.name}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          in {product.category}
                        </p>
                      </div>
                      <div className="ml-3 text-sm font-bold text-blue-600">
                        ₹{product.price}
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handleSearchSubmit()}
                className="w-full py-3 bg-gray-50 text-blue-600 text-sm font-semibold hover:bg-blue-50 transition-colors border-t border-gray-100"
              >
                View all results for "{query}"
              </button>
            </div>
          ) : !isLoading ? (
            <div className="p-8 text-center bg-white">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Search className="w-6 h-6 text-gray-400" />
              </div>
              <p className="text-gray-900 font-semibold italic text-sm">
                No matching products found for "{query}"
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Try searching for something else
              </p>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
