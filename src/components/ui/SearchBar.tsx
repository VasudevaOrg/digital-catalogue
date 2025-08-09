// src/components/ui/SearchBar.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { useAppSelector } from "@/store";
import { demoProducts } from "@/lib/demoData";
import { Search, X, Clock, TrendingUp } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: (query: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchBar({
  value,
  onChange,
  onSearch,
  placeholder = "Search products...",
  className = "",
}: SearchBarProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("recent-searches");
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (error) {
        console.error("Error loading recent searches:", error);
      }
    }
  }, []);

  // Generate suggestions based on input
  useEffect(() => {
    if (value.length >= 2) {
      const productSuggestions = demoProducts
        .filter(
          (product) =>
            product.name.toLowerCase().includes(value.toLowerCase()) ||
            product.category.toLowerCase().includes(value.toLowerCase()) ||
            product.description.toLowerCase().includes(value.toLowerCase())
        )
        .slice(0, 5)
        .map((product) => product.name);

      const categorySuggestions = Array.from(
        new Set(
          demoProducts
            .filter((product) =>
              product.category.toLowerCase().includes(value.toLowerCase())
            )
            .map((product) => product.category)
        )
      ).slice(0, 3);

      setSuggestions([
        ...new Set([...productSuggestions, ...categorySuggestions]),
      ]);
    } else {
      setSuggestions([]);
    }
  }, [value]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      performSearch(value.trim());
    }
  };

  const performSearch = (query: string) => {
    onSearch(query);
    addToRecentSearches(query);
    setShowSuggestions(false);
    inputRef.current?.blur();
  };

  const addToRecentSearches = (query: string) => {
    const updated = [
      query,
      ...recentSearches.filter((item) => item !== query),
    ].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem("recent-searches", JSON.stringify(updated));
  };

  const handleClear = () => {
    onChange("");
    onSearch("");
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setShowSuggestions(false);
      inputRef.current?.blur();
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
    setShowSuggestions(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
    // Delay hiding suggestions to allow clicking on them
    setTimeout(() => setShowSuggestions(false), 200);
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem("recent-searches");
  };

  const popularSearches = ["Rice", "Oil", "Dal", "Spices", "Sugar"];

  return (
    <div className={`relative ${className}`}>
      <form onSubmit={handleSubmit} className="relative">
        <div
          className={`
            relative flex items-center bg-white rounded-xl border-2 transition-all duration-200 shadow-sm
            ${
              isFocused
                ? "border-primary-500 shadow-lg shadow-primary-100"
                : "border-gray-200 hover:border-gray-300"
            }
          `}
        >
          <div className="absolute left-4 text-gray-400">
            <Search className="w-5 h-5" />
          </div>

          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="w-full pl-12 pr-12 py-4 bg-transparent border-none outline-none text-gray-900 placeholder-gray-500 font-medium"
          />

          {value && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-12 p-1 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          <button
            type="submit"
            className="absolute right-2 p-2 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-200"
          >
            <Search className="w-5 h-5" />
          </button>
        </div>
      </form>

      {/* Search Suggestions Dropdown */}
      {showSuggestions && (
        <div
          ref={suggestionsRef}
          className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-200 z-50 max-h-96 overflow-y-auto animate-scaleIn"
        >
          {/* Current Suggestions */}
          {suggestions.length > 0 && (
            <div className="p-4 border-b border-gray-100">
              <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                <Search className="w-4 h-4" />
                Suggestions
              </h4>
              <div className="space-y-1">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      onChange(suggestion);
                      performSearch(suggestion);
                    }}
                    className="w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Recent Searches */}
          {recentSearches.length > 0 && value.length < 2 && (
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Recent Searches
                </h4>
                <button
                  onClick={clearRecentSearches}
                  className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
                >
                  Clear all
                </button>
              </div>
              <div className="space-y-1">
                {recentSearches.map((search, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      onChange(search);
                      performSearch(search);
                    }}
                    className="w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-2"
                  >
                    <Clock className="w-3 h-3 text-gray-400" />
                    {search}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Popular Searches */}
          {value.length < 2 && (
            <div className="p-4">
              <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Popular Searches
              </h4>
              <div className="flex flex-wrap gap-2">
                {popularSearches.map((search, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      onChange(search);
                      performSearch(search);
                    }}
                    className="px-3 py-1.5 bg-gray-100 hover:bg-primary-100 text-gray-700 hover:text-primary-700 text-sm rounded-full transition-colors"
                  >
                    {search}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* No suggestions state */}
          {suggestions.length === 0 &&
            recentSearches.length === 0 &&
            value.length >= 2 && (
              <div className="p-8 text-center text-gray-500">
                <Search className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">No suggestions found</p>
                <p className="text-xs mt-1">Try a different search term</p>
              </div>
            )}
        </div>
      )}
    </div>
  );
}
